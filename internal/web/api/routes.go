// Package api defines and handles /api* routes
package api

import (
	"github.com/kataras/iris/v12"

	"github.com/homeland-live/awtrix-light-hub/internal/web/api/awtrixlight"
	"github.com/homeland-live/awtrix-light-hub/internal/web/api/health"
	"github.com/homeland-live/awtrix-light-hub/internal/web/api/node"
	"github.com/homeland-live/awtrix-light-hub/internal/web/api/status"
)

// Routes adds api routes to the iris app
func Routes(app *iris.Application) {
	app.PartyFunc("/api", func(api iris.Party) {
		health.Routes(api)
		status.Routes(api)
		node.Routes(api)
		awtrixlight.Routes(api)
	})
}
