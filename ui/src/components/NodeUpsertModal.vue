<template>
  <BaseModal ref="modal" @close="$emit('close')">
    <template #title>
      <template v-if="isCreating">
        Create new
      </template>
      <template v-else>
        Edit
      </template>
      node
    </template>
    <template #body>
      <div class="row mb-3">
        <div class="col-3">
          <span>Name:</span>
        </div>
        <div class="col-9">
          <input
            v-model.trim="model.name"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': errors.name }"
            @blur="onBlur('name')"
          />
          <div class="invalid-feedback d-flex flex-row-reverse">
            {{ errors.name }}
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-3">
          <span>IP v4 address:</span>
        </div>
        <div class="col-9">
          <input
            v-model.trim="model.ipv4"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': errors.ipv4 }"
            @blur="onBlur('ipv4')"
          />
          <div class="invalid-feedback d-flex flex-row-reverse">
            {{ errors.ipv4 }}
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-light" @click="close">
        Close
      </button>
      <button type="button" class="btn btn-primary" @click="upsert">
        <template v-if="isCreating">
          Create
        </template>
        <template v-else>
          Update
        </template>
      </button>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import { mapStores } from 'pinia';
import BaseModal from '@/components/coreui/BaseModal.vue';
import { type Node } from '@/api/hub';
import { useNodeStore } from '@/stores/node';

export default defineComponent({
  name: 'NodeUpsertModal',
  components: { BaseModal },
  props: {
    node: { type: Object as PropType<Partial<Node>>, required: true },
  },
  emits: ['upsert', 'toast', 'close'],
  data() {
    return {
      errors: ref<Record<string, string>>({}),
      model: ref<Partial<Node>>({ ...this.node }),
    };
  },
  computed: {
    isCreating(): boolean {
      return !this.node.id;
    },
    ...mapStores(
      useNodeStore, // sets this.nodeStore
    ),
  },
  mounted() {
    this.nodeStore.init();
  },
  methods: {
    onBlur(name: string) {
      if (this.errors[name]) {
        delete this.errors[name];
      }
    },
    close() {
      (this.$refs.modal as typeof BaseModal).close();
    },
    upsert() {
      this.nodeStore.upsertNode({ ...this.model }).then((data) => {
        if (!data.error) {
          if (data.node) {
            this.$emit('upsert', data.node);
          }
          this.close();
          return;
        }
        if (data.error.items) {
          data.error.items.forEach((item) => {
            this.errors[item.subject] = item.msg;
          });
        }
        this.$emit('toast', {
          title: `Error ${data.error.code}`,
          body: data.error.msg,
          icon: 'bell',
          iconColor: 'danger',
        });
      });
    },
  },
});
</script>
