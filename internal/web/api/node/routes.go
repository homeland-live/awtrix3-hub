// Package node defines and handles /nodes* routes
package node

import (
	"github.com/kataras/iris/v12"
)

// Routes adds node api routes to the iris app
func Routes(api iris.Party) {
	api.PartyFunc("/v1/nodes", func(nodes iris.Party) {
		nodes.Get("/", ListNodesHandler)
		nodes.Post("/", CreateNodeHandler)
		nodes.PartyFunc("/{id:string format(uuid)}", func(node iris.Party) {
			node.Get("/", GetNodeHandler)
			node.Patch("/", UpdateNodeHandler)
			node.Delete("/", DeleteNodeHandler)
		})
	})
}
