package node

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/objx"

	"github.com/homeland-live/awtrix-light-hub/internal/db"
)

// ListNodesHandler handles `/nodes` http get requests
func ListNodesHandler(c *fiber.Ctx) error {
	nodes := db.ListNodes()
	return c.JSON(fiber.Map{"nodes": nodes})
}

// CreateNodeHandler handles `/nodes` http post requests
func CreateNodeHandler(c *fiber.Ctx) error {
	var n db.Node
	if err := c.BodyParser(&n); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := db.CreateNode(&n); err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"node": n})
}

// GetNodeHandler handles `/nodes/:id` http get requests
func GetNodeHandler(c *fiber.Ctx) error {
	id := c.Params("id")
	n := db.FindNodeByID(id)
	if n == nil {
		return fiber.NewError(
			fiber.StatusNotFound,
			fmt.Sprintf("no node found with given id %s", id),
		)
	}
	return c.JSON(fiber.Map{"node": n})
}

// UpdateNodeHandler handles `/nodes/:id` http patch requests
func UpdateNodeHandler(c *fiber.Ctx) error {
	id := c.Params("id")
	n := db.FindNodeByID(id)
	if n == nil {
		return fiber.NewError(fiber.StatusNotFound, fmt.Sprintf("no node found with given id %s", id))
	}
	data := objx.Map{}
	if err := c.BodyParser(&n); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if err := db.UpdateNode(n, data); err != nil {
		return err
	}
	return c.JSON(fiber.Map{"node": n})
}

// DeleteNodeHandler handles `/nodes/:id` http delete requests
func DeleteNodeHandler(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := db.DeleteNode(id); err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{})
}
