// Package awtrix proxies awtrix api requests
package awtrix

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"github.com/valyala/fasthttp"
)

// Routes adds awtrix api proxy route to the fiber
func Routes(app *fiber.App) {
	proxy.WithClient(&fasthttp.Client{
		NoDefaultUserAgentHeader: true,
		DisablePathNormalizing:   true,
	})
	app.All("/awtrix/:ipv4/*", func(c *fiber.Ctx) error {
		url := fmt.Sprintf("http://%s/%s", c.Params("ipv4"), c.Params("*"))
		return proxy.DoTimeout(c, url, 1*time.Second)
	})
}
