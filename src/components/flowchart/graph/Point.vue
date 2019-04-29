<template>
    <li v-if="type === 'in'">
        <span @dragstart.stop="dragstart" @drop="drop" class="marker" draggable="true" ref="Point"
              tabindex="0"></span> {{ label }}
    </li>
    <li v-else-if="type === 'out'">
        {{ label }} <span @dragstart.stop="dragstart" @drop="drop" class="marker" draggable="true" ref="Point"
                          tabindex="0"></span>
    </li>
</template>

<script>
    export default {
        name: "Point",

        props: {
            node: {
                type: Number,
                required: true
            },

            index: {
                type: Number,
                required: true
            },

            label: {
                type: String,
                required: true
            },

            one: {
                type: Boolean,
                required: true
            },

            type: {
                type: String,
                default: 'out',
                validator: function (value) {
                    return ['in', 'out'].indexOf(value) !== -1
                }
            }
        },

        mounted: function () {
            let el = this.$refs.Point;

            //FixMe: Считает offset до загрузки шрифта.
            // использовать вот эту штуку: https://github.com/bramstein/fontfaceobserver.

            this.style = getComputedStyle(el);
            this.offset = {
                top: parseFloat(this.style.width) / 2,
                left: parseFloat(this.style.height) / 2
            };

            while (!el.classList.contains('component')) {
                this.offset.top += parseFloat(el.offsetTop);
                this.offset.left += parseFloat(el.offsetLeft);
                el = el.offsetParent;
            }

            this.$refs.Point.onmousedown = this.$refs.Point.onmousemove = this.$refs.Point.onmouseup = function (e) {
                e.stopPropagation();
            };
        },

        methods: {
            activate: function () {
                this.$store.commit('flowchart/UPDATE_ACTIVE', this.node)
            },

            dragstart: function (e) {
                this.activate();

                e.dataTransfer.setData('text/plain', JSON.stringify({
                    node: this.node,
                    index: this.index,
                    type: this.type,
                    offset: this.offset
                }));
            },

            drop: function (e) {
                let data = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');

                if ((this.type === 'in' && data.type === 'out') || (this.type === 'out' && data.type === 'in')) {
                    this.activate();

                    this.$emit('link', {
                        one: this.one,
                        startNode: (this.type === 'out') ? this.node : data.node,
                        startPoint: (this.type === 'out') ? this.index : data.index,
                        endNode: (this.type === 'in') ? this.node : data.node,
                        endPoint: (this.type === 'in') ? this.index : data.index,
                        points: {
                            x1: (this.type === 'out') ? this.offset.left : data.offset.left,
                            y1: (this.type === 'out') ? this.offset.top : data.offset.top,
                            x2: (this.type === 'in') ? this.offset.left : data.offset.left,
                            y2: (this.type === 'in') ? this.offset.top : data.offset.top
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../scss/functions";
    li {
        letter-spacing: 0.04em;

        span {
            $size: em(22px);

            width: $size;
            height: $size;
            vertical-align: top;
            display: inline-block;
            background-color: whitesmoke;
        }
    }
</style>