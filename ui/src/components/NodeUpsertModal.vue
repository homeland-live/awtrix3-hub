<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef } from 'vue';
import BaseModal from '@/components/coreui/BaseModal.vue';
import { type Node } from '@/api/hub';
import { type Toast } from '@/types/coreui';
import { useNodeStore } from '@/stores/node';

const props = defineProps<{
  node: Partial<Node>;
}>();

const emit = defineEmits<{
  (e: 'upsert', n: Node): void;
  (e: 'toast', t: Toast): void;
  (e: 'close'): void;
}>();

const modal = useTemplateRef('modal');

const nodeStore = useNodeStore();

const errors = ref<Record<string, string>>({});
const model = ref<Partial<Node>>({ ...props.node });

const isCreating = computed<boolean>(() => !props.node.id);

onMounted(nodeStore.init);

function onBlur(name: string) {
  if (errors.value[name]) {
    delete errors.value[name];
  }
}

function close() {
  if (modal.value) {
    modal.value?.close();
  }
}

function upsert() {
  nodeStore.upsertNode({ ...model.value }).then((data) => {
    if (!data.error) {
      if (data.node) {
        emit('upsert', data.node);
      }
      close();
      return;
    }
    if (data.error.items) {
      data.error.items.forEach((item) => {
        errors.value[item.subject] = item.msg;
      });
    }
    emit('toast', {
      title: `Error ${data.error.code}`,
      body: data.error.msg,
      icon: 'bell',
      iconColor: 'danger',
    });
  });
}
</script>

<template>
  <BaseModal ref="modal" @close="$emit('close')">
    <template #title>
      <template v-if="isCreating">Create new</template>
      <template v-else>Edit</template>
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
      <button type="button" class="btn btn-light" @click="close">Close</button>
      <button type="button" class="btn btn-primary" @click="upsert">
        <template v-if="isCreating">Create</template>
        <template v-else>Update</template>
      </button>
    </template>
  </BaseModal>
</template>
