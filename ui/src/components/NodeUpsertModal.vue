<template>
  <BaseModal ref="modal" @close="$emit('close')">
    <template v-slot:title>
      <template v-if="isCreating">Create new</template>
      <template v-else>Edit</template>
      node
    </template>
    <template v-slot:body>
      <div class="row mb-3">
        <div class="col-3">
          <span>Name:</span>
        </div>
        <div class="col-9">
          <input
            class="form-control form-control-sm"
            :class="{ 'is-invalid': errors.name }"
            v-model.trim="model.name"
            @blur="onBlur('name')" />
          <div class="invalid-feedback d-flex flex-row-reverse">{{ errors.name }}</div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-3">
          <span>IP v4 address:</span>
        </div>
        <div class="col-9">
          <input
            class="form-control form-control-sm"
            :class="{ 'is-invalid': errors.ipv4 }"
            v-model.trim="model.ipv4"
            @blur="onBlur('ipv4')" />
          <div class="invalid-feedback d-flex flex-row-reverse">{{ errors.ipv4 }}</div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-light" @click="close">Close</button>
      <button type="button" class="btn btn-primary" @click="upsert">
        <template v-if="isCreating">Create</template>
        <template v-else>Update</template>
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
  emits: ['close', 'toast'],
  components: { BaseModal },
  props: {
    node: { type: Object as PropType<Partial<Node>>, required: true },
  },
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
      const fn = this.isCreating ? this.nodeStore.createNode : this.nodeStore.updateNode;
      fn({ ...this.model }).then((err) => {
        if (!err) {
          this.close();
          return;
        }
        if (err.items) {
          err.items.forEach((item) => {
            this.errors[item.subject] = item.msg;
          });
        }
        this.$emit('toast', {
          title: `Error ${err.code}`,
          body: err.msg,
          icon: 'bell',
          iconColor: 'danger',
        });
      });
    },
  },
  mounted() {
    this.nodeStore.init();
  },
});
</script>
