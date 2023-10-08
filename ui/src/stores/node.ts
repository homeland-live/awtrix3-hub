import { defineStore } from 'pinia';
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
  nodes: Node[],
  activeNode: Node | undefined,
  initialized: boolean,
  isLoading: boolean,
  error: Err | undefined,
};

const ls = new LocalStore('node');

export const useNodeStore = defineStore({
  id: 'node',
  state: (): State => ({
    nodes: [],
    activeNode: undefined,
    initialized: false,
    isLoading: false,
    error: undefined,
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
      });
    },
    reload(): Promise<void> {
      this.$reset();
      return this.init();
    },
    setActiveNode(node: Node) {
      this.activeNode = node;
      ls.writeS('activeId', node.id);
    },
    unsetActiveNode() {
      this.activeNode = undefined;
      ls.writeS('activeId', '');
    },
    createNode(payload: Record<string, unknown>): Promise<Err | undefined> {
      return createNode(payload).then((data) => {
        if (data.node) {
          this.nodes.push(data.node);
          this.setActiveNode(data.node);
        }
        return data.error;
      });
    },
    updateNode(payload: Record<string, unknown>): Promise<Err | undefined> {
      return updateNode(payload).then((data) => {
        if (data.node) {
          const n = this.nodes.find((item) => item.id === data.node?.id);
          if (n) {
            n.name = data.node.name;
            n.ipv4 = data.node.ipv4;
            n.updatedAt = data.node.updatedAt;
          }
        }
        return data.error;
      });
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
