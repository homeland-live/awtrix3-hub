package db

import (
	"github.com/avakarev/go-util/gormutil"
	"github.com/stretchr/objx"
)

// Node represents record from `nodes` db table
type Node struct {
	gormutil.ModelBase
	Name string `json:"name" validate:"required" gorm:"uniqueIndex"`
	IPV4 string `json:"ipv4" validate:"required,ipv4" gorm:"uniqueIndex"`
}

// ListNodes lists node items
func ListNodes() []Node {
	q := db.Conn().Order("name asc")
	return gormutil.Find[Node](q)
}

// FindNodeByID finds node by given id
func FindNodeByID(id string) *Node {
	q := db.Conn().Where("id = ?", id)
	return gormutil.First[Node](q)
}

// CreateNode inserts given node attrs to the db as new row
func CreateNode(n *Node) error {
	if err := n.GenerateID(); err != nil {
		return err
	}
	return db.Create(n)
}

// UpdateNode updates existing node with given attrs
func UpdateNode(n *Node, params objx.Map) error {
	fields := make([]string, 0)
	if params.Has("name") {
		n.Name = params.Get("name").Str()
		fields = append(fields, "Name")
	}
	if params.Has("ipv4") {
		n.IPV4 = params.Get("ipv4").Str()
		fields = append(fields, "IPV4")
	}
	return db.Update(n, fields...)
}

// DeleteNode deletes node with given id
func DeleteNode(id string) error {
	return db.DeleteByID(&Node{}, id)
}
