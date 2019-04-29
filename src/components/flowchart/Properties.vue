<template>
    <div class="properties" v-if="node && editable">
        <form>
            <fieldset v-if="name">
                <legend>Имя</legend>
                <label>
                    <input type="text" v-model="name">
                </label>
            </fieldset>
        </form>
    </div>
    <div v-else-if="node && !editable"></div>
    <div v-else></div>
</template>

<script>
    import NodeComponentPropertiesMixin from "./NodeComponentPropertiesMixin"

    export default {
        name: "Properties",
        mixins: [NodeComponentPropertiesMixin],
        computed: {
            node: {
                get: function () {
                    return this.$store.getters['flowchart/activeNode'];
                },

                set: function (value) {
                    this.$store.dispatch('flowchart/update_active_node', Object.assign(this.node, value))
                }
            },

            editable: function () {
                return (this.node.editable == null) ? false : this.node.editable;
            },
        },
    }
</script>

<style lang="scss" scoped>
    .properties {
        $border-radius: 10px;

        text-align: left;

        fieldset {
            padding: 0;
            display: flex;
            flex-direction: row;
            border-radius: 10px;
            border-style: solid;
            border-color: lightgray;

            legend {
                z-index: 1;
                padding: 0 8px;
                font-size: smaller;
                position: relative;
                margin-bottom: -8px;
                font-weight: bolder;
                letter-spacing: 0.06em;
                margin-left: $border-radius;
            }

            label {
                input, select, textarea {
                    border: none;
                    font: inherit;
                    outline: none;
                    padding: 10px;
                    box-sizing: border-box;
                    border-radius: $border-radius;
                }
            }
        }
    }
</style>