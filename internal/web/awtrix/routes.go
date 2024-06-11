// Package awtrix proxies awtrix api requests
package awtrix

import (
	"fmt"
	"strings"
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
		ipv4 := c.Params("ipv4")
		path := c.Params("*")
		url := fmt.Sprintf("http://%s/%s", ipv4, path)
		if err := proxy.DoTimeout(c, url, 2*time.Second); err != nil {
			return err
		}
		if ctype := string(c.Response().Header.ContentType()); strings.HasPrefix(ctype, "text/html") {
			if path == "fullscreen" {
				resp := c.Response()
				resp.SetBodyString(strings.ReplaceAll(string(resp.Body()), "/api/screen", fmt.Sprintf("/awtrix/%s/api/screen", ipv4)))
			}
		}
		return nil
	})
}
