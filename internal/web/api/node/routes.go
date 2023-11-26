// Package node defines and handles /nodes* routes
package node

import (
	"github.com/gofiber/fiber/v2"
)

// Routes adds node api routes to the fiber
func Routes(api fiber.Router) {
	nodes := api.Group("/v1/nodes")
	nodes.Get("/", ListNodesHandler)
	nodes.Post("/", CreateNodeHandler)

	node := nodes.Group("/:id")
	node.Get("/", GetNodeHandler)
	node.Patch("/", UpdateNodeHandler)
	node.Delete("/", DeleteNodeHandler)
}
