<template>
    <div :style="{transform: `translate(${x}px, ${y}px)`, width: `${w}px`, height: `${h}px`, zIndex: edit ? 1 : 0}"
         class="component process" ref="Root">
        <div :class="{'active': edit}" class="card flip">
            <div>
                <button @click="remove()" class="remove"></button>
                <h3>{{ name }}</h3>
                <button @click="edit = true">Edit</button>
                <div class="params">
                    <Points :points="points" @link="$emit('link', $event)" ref="Points"></Points>
                </div>
            </div>
            <div>
                <form @submit.stop.prevent="edit = false">
                    <label>
                        <input v-model="name">
                    </label>
                    <button type="submit">OK</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import ComponentMixin from './ComponentMixin';
    import Points from "@/components/flowchart/Points";

    export default {
        name: "Scene",
        components: {Points},
        mixins: [
            ComponentMixin
        ],

        data: function () {
            return {
                edit: false
            }
        },

        computed: {
            name: {
                get: function () {
                    let name = this.$store.getters['flowchart/nodes'][this.index].name;
                    return (name == null) ? 'Scene' : name;
                },

                set: function (value) {
                    this.$store.commit('flowchart/UPDATE_NODE', {
                        index: this.index,
                        node: {name: value}
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "scss/component";

    div {
        @include component;

        & > .card {
            @include process {
                position: relative;
            }
        ;

            &.flip {
                perspective: 1000px;
                transition: transform 300ms;
                transform-style: preserve-3d;

                &.active {
                    transform: rotateY(180deg);

                    & > *:first-child {
                        pointer-events: none;
                    }

                    & > *:last-child {
                        opacity: 1;
                        pointer-events: auto;
                    }
                }

                & > * {
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: dimgray;
                }

                & > *:first-child {
                    overflow: hidden;
                    pointer-events: auto;
                }

                & > *:last-child {
                    opacity: 0;
                    position: absolute;
                    pointer-events: none;
                    transform: rotateY(180deg);
                    backface-visibility: hidden;
                }
            }

            button {
                @include remove;
            }
        }
    }
</style>