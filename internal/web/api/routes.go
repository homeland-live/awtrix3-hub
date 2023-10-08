// Package api defines and handles /api* routes
package api

import (
	"github.com/kataras/iris/v12"

	"github.com/awtrix-light/hub/internal/web/api/health"
	"github.com/awtrix-light/hub/internal/web/api/node"
	"github.com/awtrix-light/hub/internal/web/api/status"
)

// Routes adds api routes to the iris app
func Routes(app *iris.Application) {
	app.PartyFunc("/api", func(api iris.Party) {
		health.Routes(api)
		status.Routes(api)
		node.Routes(api)
	})
}
