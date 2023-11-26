// Package web implements web server and handles web traffic
package web

import (
	"errors"
	"os"

	"github.com/avakarev/go-util/httputil"
	"github.com/gofiber/contrib/fiberzerolog"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/rs/zerolog/log"

	"github.com/homeland-live/awtrix-light-hub/internal/web/api"
	"github.com/homeland-live/awtrix-light-hub/internal/web/awtrix"
	"github.com/homeland-live/awtrix-light-hub/internal/web/ui"
)

// DefaultPort is default http port
const DefaultPort = "8081"

var port string

// Serve starts an HTTP server
func Serve() error {
	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			httpErr := httputil.NewErrFrom(err)

			var e *fiber.Error
			if errors.As(err, &e) {
				httpErr.Error.Code = e.Code
			}

			return c.Status(httpErr.Error.Code).JSON(httpErr)
		},
	})
	app.Use(recover.New())
	app.Use(fiberzerolog.New())

	api.Routes(app)
	ui.Routes(app)
	awtrix.Routes(app)

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
