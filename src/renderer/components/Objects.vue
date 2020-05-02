<template>
  <div id="objects">
    <vue-context
        v-for="group in groups"
        :key="`edit_${group.id}`"
        ref="menu"
        :data="`edit_${group.id}`"
    >
        <li>
            <a href="#" @click.prevent="toggleGroupEdit(group.id, $event); setFocus(group.id);">Rename Group</a>
        </li>
        <li>
            <a href="#">Delete Group + Items</a>
        </li>
        <li>
            <a href="#">Delete Group Only</a>
        </li>
    </vue-context>
    <!-- Groups -->
    <div
        v-for="group in groups"
        :key="group.id"
        class="group"
    >
        <div class="group_title" @contextmenu.prevent="openMenu(`edit_${group.id}`, $event)">
            <div class="toggle" @click="toggleGroup(group.id)">
                <i :class="[group.open ? 'mdi-menu-down' : 'mdi-menu-right', 'mdi']"></i>
            </div>
            <div class="group_label">
                <div :ref="`label_${group.id}`" :contenteditable="group.edit" @blur="setGroupLabel(group.id, $event); toggleGroupEdit(group.id, $event);" @click="toggleGroup(group.id)" v-text="group.label"></div>
            </div>
        </div>
        <div v-if="group.open" class="group_content">
        
                <div
                    v-for="o in objects.slice().reverse()"
                    v-show="o.group === group.id"
                    :key="o.id"
                    class="object"
                >
                    <div class="title" @click="setActiveObject(o.id)">
                            <div class="isActive">
                                <i :style="{'color': o.active ? 'limegreen' : '#333333'}" class="mdi mdi-circle"></i>
                            </div>
                            <div class="label">
                                <i v-if="o.category === 'block'" class="mdi mdi-cube-outline"></i>
                                <i v-if="o.category === 'entity'" class="mdi mdi-alpha-e-circle-outline"></i>
                                <i v-if="o.category === 'model'" class="mdi mdi-ufo-outline"></i>
                                <span>{{o.label}} ({{o.type}})</span>
                            </div>
                    </div>
                </div>
            </div>

    </div>

    <!-- Non-Groups -->
    <div class="ungrouped">
        <div
            v-for="o in objects.slice().reverse()"
            v-show="!o.group"
            :key="o.id"
            class="object"
        >
            <div class="title" @click="setActiveObject(o.id)">
                    <div class="isActive">
                        <i :style="{'color': o.active ? 'limegreen' : '#333333'}" class="mdi mdi-circle"></i>
                    </div>
                    <div class="label">
                        <i v-if="o.category === 'block'" class="mdi mdi-cube-outline"></i>
                        <i v-if="o.category === 'entity'" class="mdi mdi-alpha-e-circle-outline"></i>
                        <i v-if="o.category === 'model'" class="mdi mdi-ufo-outline"></i>
                        <span>{{o.label}} ({{o.type}})</span>
                    </div>
            </div>
        </div>
    </div>

    <div v-if="!objects.length && !groups.length" class="message" >No objects</div>

  </div>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable vue/no-use-v-if-with-v-for */
export default {
  name: 'Objects',
  computed: {
      objects () {
        return this.$store.state.map.objects;
      },
      groups () {
          return this.$store.state.map.groups;
      }
  },
  methods: {
    setFocus (id) {
        const el = this.$refs[`label_${id}`][0];

        this.$nextTick(() => {
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(el.childNodes[0], el.childNodes[0].textContent.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        })
    },
    toggleGroup (id) {
        this.$store.commit('toggleGroup', id);
    },
    toggleGroupEdit (id) {
        this.$store.commit('toggleGroupEdit', id);
    },
    setGroupLabel (id, e) {
        this.$store.commit('setGroupLabel', {
            id,
            label: e.target.innerText
        });
    },
    openMenu(itemIndex, event) {
        for (const [index, VueComponent] of this.$refs.menu.entries()) {
            if (VueComponent.$attrs.data === itemIndex) {
                this.$refs.menu[index].open(event);
                break;
            }
        }
    },
    setActiveObject (id) {
        if (id === this.activeObject) {
            this.$store.commit('setActiveObject', null);
        } else {
            this.$store.commit('setActiveObject', id);
        }
    }
  }
};
</script>