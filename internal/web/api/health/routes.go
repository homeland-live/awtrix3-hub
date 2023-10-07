// Package health defines and handles /health route
package health

import (
	"github.com/kataras/iris/v12"
	"github.com/rs/zerolog/log"
)

// Routes adds health api routes to the iris app
func Routes(api iris.Party) {
	api.Get("/v1/health", func(ctx iris.Context) {
		if err := ctx.JSON(iris.Map{"healthy": true}); err != nil {
			log.Error().Err(err).Send()
		}
	})
}
