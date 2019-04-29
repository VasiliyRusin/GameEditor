<template>
    <svg xmlns="http://www.w3.org/2000/svg">
        <g :style="{ transform: transform }">
            <path :d="path"></path>
            <circle :cx="points.x1 + 1" :cy="points.y1" r="6"></circle>
            <circle :cx="points.x2 - 1" :cy="points.y2" r="6"></circle>
        </g>
    </svg>
</template>

<script>
    export default {
        name: "Link",

        props: {
            points: {
                type: Object,
                required: true
            }
        },

        computed: {
            transform: function () {
                let offset = (100 - this.scale * 100) / 2;
                return `translate(${offset}%, ${offset}%) scale(${this.scale})`
            },

            scale: function () {
                return this.$store.getters['flowchart/scale'];
            },

            path: function () {
                let p = this.points,
                    offset = {
                        p1: {
                            x: Math.abs(p.x1 - p.x2) / 1.5,
                            y: 0
                        },
                        p2: {
                            x: Math.abs(p.x1 - p.x2) / 1.5,
                            y: 0
                        }
                    };

                if (p.x1 - p.x2 > 80) {
                    if (p.x1 + 80 < screen.width) offset.p1.x += 80;
                    else offset.p1.x = screen.width - p.x1;

                    if (p.x2 - 80 > 0) offset.p1.x -= 80;
                    else offset.p1.x = 0;
                } else if (p.x1 - p.x2 < 80) {
                    if (p.x1 + 80 < screen.width) offset.p1.x += 80;
                    else offset.p1.x = screen.width - p.x1;

                    if (p.x2 - 80 > 0) offset.p1.x -= 80;
                    else offset.p1.x = 0;
                }

                return `M${p.x1},${p.y1} ` +
                    `C${p.x1 + offset.p1.x},${p.y1 + offset.p1.y} ${p.x2 - offset.p2.x},${p.y2 + offset.p2.y} ` +
                    `${p.x2},${p.y2}`;
            }
        }
    }
</script>

<style lang="scss" scoped>
    svg {
        $color: red;

        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        fill: $color;
        stroke: $color;
        position: absolute;
        pointer-events: none;

        path {
            stroke-width: 4;
            fill: transparent;
        }
    }
</style>