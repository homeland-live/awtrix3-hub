// Package web implements web server and handles web traffic
package web

import (
	"os"

	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/recover"
	"github.com/rs/zerolog/log"

	"github.com/awtrix-light/hub/internal/irisutil"
)

// DefaultPort is default http port
const DefaultPort = "8081"

var port string

// Serve starts an HTTP server
func Serve() error {
	app := iris.New()
	app.Configure(
		iris.WithoutPathCorrection,
		iris.WithoutStartupLog,
	)
	app.Logger().Handle(irisutil.LogHandler)
	app.Use(recover.New())

	// logs successful requests
	app.Use(irisutil.LogMiddleware())

	// logs panicked requests
	app.OnAnyErrorCode(irisutil.ErrMiddleware)

	irisutil.LogRoutes(app)
	log.Info().Str("url", "http://localhost:"+port).Msg("starting web server")
	return app.Listen(":" + port)
}

// Init initializes web
func Init() error {
	port = DefaultPort
	if p := os.Getenv("HTTP_PORT"); p != "" {
		port = p
	}
	return nil
}

// MustInit is like Init but panics in case of error
func MustInit() {
	if err := Init(); err != nil {
		panic("web.MustInit(): " + err.Error())
	}
}
