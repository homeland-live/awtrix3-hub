// Package status defines and handles /status/* routes
package status

import (
	"github.com/avakarev/go-util/buildmeta"
	"github.com/kataras/iris/v12"

	"github.com/homeland-live/awtrix-light-hub/internal/irisutil"
)

// Routes adds event api routes to the iris app
func Routes(api iris.Party) {
	api.PartyFunc("/v1/status", func(status iris.Party) {
		status.Get("/buildinfo", func(ctx iris.Context) {
			irisutil.WriteJSON(buildmeta.Fields(), ctx)
		})
	})
}
