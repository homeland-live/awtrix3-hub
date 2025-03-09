import { defineStore } from 'pinia';
import { useAwtrixStore } from '@/stores/awtrix';
import {
  listNodes,
  createNode,
  updateNode,
  deleteNode,
  type Node,
  type Err,
} from '@/api/hub';
import { LocalStore } from '@/util/store';

export type State = {
  isLoading: boolean,
  initialized: boolean,
  error: Err | undefined,
  nodes: Node[],
  activeNode: Node | undefined,
};

const ls = new LocalStore('node');

export const useNodeStore = defineStore('node', {
  state: (): State => ({
    isLoading: false,
    initialized: false,
    error: undefined,
    nodes: [],
    activeNode: undefined,
  }),
  actions: {
    init(): Promise<void> {
      if (this.initialized) {
        return Promise.resolve();
      }
      this.initialized = true;
      this.isLoading = true;
      return listNodes().then((data) => {
        this.isLoading = false;
        if (data.error) {
          this.error = data.error;
          return;
        }
        this.nodes = data.nodes || [];
      }).then(() => {
        const activeId = ls.readS('activeId');
        this.activeNode = this.nodes.find((item) => item.id === activeId);
        if (this.activeNode) {
          useAwtrixStore().reload(this.activeNode.ipv4);
        }
      });
    },
    reload(): Promise<void> {
      this.$reset();
      return this.init();
    },
    setActiveNode(node: Node) {
      useAwtrixStore().reload(node.ipv4);
      this.activeNode = node;
      ls.writeS('activeId', node.id);
    },
    unsetActiveNode() {
      useAwtrixStore().reload();
      this.activeNode = undefined;
      ls.writeS('activeId', '');
    },
    createNode(payload: Record<string, unknown>): Promise<{node?: Node, error?: Err}> {
      return createNode(payload).then((data) => {
        if (data.node) {
          this.nodes.push(data.node);
        }
        return data;
      });
    },
    updateNode(payload: Record<string, unknown>): Promise<{node?: Node, error?: Err}> {
      return updateNode(payload).then((data) => {
        if (data.node) {
          const n = this.nodes.find((item) => item.id === data.node?.id);
          if (n) {
            n.name = data.node.name;
            n.ipv4 = data.node.ipv4;
            n.updatedAt = data.node.updatedAt;
          }
        }
        return data;
      });
    },
    upsertNode(payload: Record<string, unknown>): Promise<{node?: Node, error?: Err}> {
      const fn = !payload.id ? this.createNode : this.updateNode;
      return fn(payload);
    },
    deleteNode(id: string): Promise<Err | undefined> {
      return deleteNode(id).then((data) => {
        if (!data.error) {
          this.nodes = this.nodes.filter((item) => item.id !== id);
          if (this.activeNode && this.activeNode.id === id) {
            this.unsetActiveNode();
          }
        }
        return data.error;
      });
    },
  },
});
