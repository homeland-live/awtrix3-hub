// Package irisutil implements iris helpers
package irisutil

import (
	"fmt"
	"net/http"
	"time"

	"github.com/avakarev/go-util/httputil"
	"github.com/kataras/golog"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/context"
	"github.com/kataras/iris/v12/middleware/logger"
	"github.com/rs/zerolog/log"
)

// WriteJSON responds given value as json
func WriteJSON(v interface{}, ctx iris.Context) {
	if err := ctx.JSON(v); err != nil {
		log.Error().Err(err).Send()
	}
}

// WriteErrJSON responds given err as json
func WriteErrJSON(err *httputil.ErrResponse, ctx iris.Context) {
	ctx.StatusCode(err.Error.Code)
	WriteJSON(err, ctx)
}

// RequestLogFunc is the iris log writer
func RequestLogFunc(_ time.Time, latency time.Duration, status, ip, method, path string, _ interface{}, _ interface{}) {
	log.Info().
		Str("latency", fmt.Sprint(latency)).
		Str("status", status).
		Str("ip", ip).
		Str("method", method).
		Str("path", path).
		Send()
}

// LogMiddleware returns iris log middleware
func LogMiddleware() context.Handler {
	return logger.New(logger.Config{
		Status:  true,
		IP:      true,
		Method:  true,
		Path:    true,
		Query:   true,
		LogFunc: RequestLogFunc,
	})
}

// ErrMiddleware logs panicked requests
func ErrMiddleware(ctx iris.Context) {
	if ctx.GetHeader("Accept") != context.ContentJSONHeaderValue {
		ctx.Next()
		return
	}

	status := ctx.GetStatusCode()
	e := log.Info()
	if status == http.StatusInternalServerError {
		e = log.Warn()
	}
	e.
		Str("path", ctx.Path()).
		Int("code", status).
		Msg(httputil.StdErrMsg(status))
	WriteJSON(httputil.NewErr(status, ""), ctx)
}

// LogHandler returns log handler func for `iris` app
func LogHandler(l *golog.Log) bool {
	switch l.Level {
	case golog.FatalLevel:
		log.Fatal().Fields(l.Fields).Msg(l.Message)
	case golog.ErrorLevel:
		log.Error().Fields(l.Fields).Msg(l.Message)
	case golog.WarnLevel:
		log.Warn().Fields(l.Fields).Msg(l.Message)
	case golog.InfoLevel:
		log.Info().Fields(l.Fields).Msg(l.Message)
	case golog.DebugLevel:
		log.Debug().Fields(l.Fields).Msg(l.Message)
	default:
		log.Error().
			Err(fmt.Errorf("unknown iris log level: %s", golog.GetTextForLevel(l.Level, false))).
			Msg(l.Message)
	}

	return true
}

// LogRoutes logs iris routes
func LogRoutes(app *iris.Application) {
	for _, r := range app.GetRoutes() {
		if r.Path != "" && r.Method != "" {
			log.Info().Str("path", r.Path).Str("method", r.Method).Msg("http route")
		}
	}
}
