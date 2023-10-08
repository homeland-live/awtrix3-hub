// Package awtrix proxies awtrix api requests
package awtrix

import (
	"fmt"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"

	"github.com/kataras/iris/v12"
)

// Routes adds awtrix api proxy route to the iris app
func Routes(app *iris.Application) {
	app.Any("/awtrix/{ipv4}/{path:path}", func(ctx iris.Context) {
		targetHost, _ := url.Parse(fmt.Sprintf("http://%s", ctx.Params().Get("ipv4")))

		proxy := httputil.NewSingleHostReverseProxy(targetHost)

		stdDirector := proxy.Director
		proxy.Director = func(req *http.Request) {
			stdDirector(req)
			req.URL.Path = "/" + ctx.Params().Get("path")
		}

		proxy.Transport = &http.Transport{
			Proxy: http.ProxyFromEnvironment,
			DialContext: (&net.Dialer{
				Timeout: 1000 * time.Millisecond,
			}).DialContext,
		}

		proxy.ServeHTTP(ctx.ResponseWriter(), ctx.Request())
	})
}
