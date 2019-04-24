<template>
    <div :style="{transform: `translate(${x}px, ${y}px)`, width: `${w}px`, height: `${h}px`}"
         :class="{ active: active === index }" @click.stop class="component" ref="Root">
        <div class="wrapper">
            <button @click="remove()" class="remove" v-if="removable"></button>
            <div class="card terminal">
                <div>
                    <h3 class="title">{{ name }}</h3>
                    <div class="params">
                        <Points :points="points" @link="$emit('link', $event)" ref="Points"></Points>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Points from "@/components/flowchart/Points";

    export default {
        name: "Node",
        components: {Points},
        props: {
            index: {
                type: Number,
                required: true
            }
        },

        mounted: function () {
            let drag = false,
                offset = {
                    x: 0,
                    y: 0
                };

            this.move = async () => {
                this.$emit('move', {
                    index: this.index,
                    x: this.x,
                    y: this.y,
                    points: await this.$refs.Points.positions()
                });
            };

            this.mousemove = (e) => {
                if (drag) {
                    this.x += e.movementX / this.scale;
                    this.y += e.movementY / this.scale;

                    this.move();
                }
            };

            this.mouseleave = (e) => {
                if (drag) {
                    offset.x = e.pageX - this.x;
                    offset.y = e.pageY - this.y;
                }
            };

            this.mouseenter = (e) => {
                if (drag) {
                    this.x = e.pageX - offset.x;
                    this.y = e.pageY - offset.y;
                }
            };

            this.$el.onmousedown = (e) => {
                if (e.button === 0) {
                    drag = true;
                    this.active = this.index;
                }
            };

            this.mouseup = (e) => {
                if (e.button === 0 && drag) drag = false;
            };

            this.drop = () => drag = false;

            // fix parent for Node abstraction
            this.$parent.$parent.$el.addEventListener('drop', this.drop);
            this.$parent.$parent.$el.addEventListener('mousemove', this.mousemove);
            this.$parent.$parent.$el.addEventListener('mouseleave', this.mouseleave);
            this.$parent.$parent.$el.addEventListener('mouseenter', this.mouseenter);
            document.addEventListener('mouseup', this.mouseup);
        },

        computed: {
            scale: function () {
                return this.$store.getters['flowchart/scale'];
            },

            active: {
                get: function () {
                    return this.$store.getters['flowchart/active'];
                },

                set: function (value) {
                    this.$store.commit('flowchart/UPDATE_ACTIVE', value)
                }
            },

            node: {
                get: function () {
                    return this.$store.getters['flowchart/nodes'][this.index];
                },

                set: function (value) {
                    this.$store.commit('flowchart/UPDATE_NODE', {
                        index: this.index,
                        node: Object.assign(this.node, value)
                    })
                }
            },

            name: {
                get: function () {
                    return this.node.name || '';
                },

                set: function (value) {
                    this.node = {name: value};
                }
            },

            x: {
                get: function () {
                    return this.node.x || 0;
                },

                set: function (value) {
                    this.node = {x: value};
                }
            },

            y: {
                get: function () {
                    return this.node.y || 0;
                },

                set: function (value) {
                    this.node = {y: value};
                }
            },

            w: {
                get: function () {
                    return this.node.w || 0;
                },

                set: function (value) {
                    this.node = {w: value};
                }
            },

            h: {
                get: function () {
                    return this.node.h || 0;
                },

                set: function (value) {
                    this.node = {h: value};
                }
            },

            removable: function () {
                return (this.node.removable == null) ? true : this.node.removable;
            },

            points: {
                get: function () {
                    return this.node.points || [];
                },

                set: function (value) {
                    this.node = {points: value};
                }
            }
        },

        methods: {
            remove: function () {
                this.$store.dispatch('flowchart/remove_node', this.index);
            }
        },

        beforeDestroy: function () {
            this.$parent.$parent.$el.removeEventListener('drop', this.drop);
            this.$parent.$parent.$el.removeEventListener('mousemove', this.mousemove);
            this.$parent.$parent.$el.removeEventListener('mouseenter', this.mouseenter);
            document.removeEventListener('mouseup', this.mouseup);
        }
    }
</script>

<style lang="scss" scoped>
    @import "scss/node";

    .component {
        @include non-select;

        top: 0;
        left: 0;
        color: whitesmoke;
        position: absolute;
        border: 1px solid lightgray;

        &.active {
            z-index: 1;
            border-color: deepskyblue;

            &:before {
                $offset: 10px;

                content: '';
                margin: auto;
                top: $offset;
                left: $offset;
                right: $offset;
                bottom: $offset;
                position: absolute;
                box-shadow: 0 0 20px 10px transparentize(deepskyblue, 0.2);
            }
        }

        .wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            box-sizing: border-box;

            button {
                &.remove {
                    $size: 30px;

                    top: 0;
                    right: 0;
                    border: none;
                    width: $size;
                    height: $size;
                    overflow: hidden;
                    position: absolute;
                    background-color: dimgray;

                    &:before, &:after {
                        content: '';
                        top: 50%;
                        left: 50%;
                        width: 2px;
                        position: absolute;
                        height: $size * 0.6;
                        background-color: whitesmoke;
                        transform: translate(-50%, -50%) rotate(45deg);
                    }

                    &:after {
                        transform: translate(-50%, -50%) rotate(-45deg);
                    }
                }
            }

            .card {
                width: 100%;
                height: 100%;

                & > div {
                    overflow: hidden;
                }

                .title {
                    overflow: hidden;
                }

                @include terminal;
                @include process;
            }
        }
    }
</style>