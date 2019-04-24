<template>
    <li v-if="type === 'in'">
        <span class="marker" draggable="true" ref="Point" tabindex="0"></span> {{ label }}
    </li>
    <li v-else-if="type === 'out'">
        {{ label }} <span class="marker" draggable="true" ref="Point" tabindex="0"></span>
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

            type: {
                type: String,
                default: 'out',
                validator: function (value) {
                    return ['in', 'out'].indexOf(value) !== -1
                }
            }
        },

        data: function () {
            return {
                one: true
            }
        },

        mounted: function () {
            let el = this.$refs.Point;

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

            this.$el.ondragstart = (e) => {
                e.stopPropagation();

                e.dataTransfer.setData('text/plain', JSON.stringify({
                    node: this.node,
                    index: this.index,
                    type: this.type,
                    offset: this.offset
                }));
            };

            this.$el.ondrop = (e) => {
                e.stopPropagation();

                let data = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');

                if ((this.type === 'in' && data.type === 'out') || this.type === 'out' && data.type === 'in') {
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
            };
        }
    }
</script>

<style lang="scss" scoped>
    li {
        span {
            $size: 1em;

            width: $size;
            height: $size;
            display: inline-block;
            vertical-align: middle;
            background-color: whitesmoke;
        }
    }
</style>