// Package ui defines and handles /ui* routes
package ui

import (
	"github.com/kataras/iris/v12"
)

// Routes adds ui routes to the iris app
func Routes(app *iris.Application) {
	app.HandleDir("/ui", "ui/dist")
	app.Get("/", func(ctx iris.Context) {
		ctx.Redirect("/ui", iris.StatusTemporaryRedirect)
	})
}
