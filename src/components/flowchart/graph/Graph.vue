<template>
    <div @dragenter.prevent @dragover.prevent @drop.prevent="drop">
        <div class="controls">
            <table>
                <tr>
                    <td>
                        <label>
                            <!--                            <input type="range" list="range" min="0.25" max="2.5" step="0.25" v-model.number="scale">-->

                            <datalist id="range">
                                <option label="0.25x" value="0.25"></option>
                                <!--                                <option value="0.50"></option>-->
                                <!--                                <option value="0.75"></option>-->
                                <option label="1x" value="1.0"></option>
                                <!--                                <option value="1.25"></option>-->
                                <!--                                <option value="1.5"></option>-->
                                <!--                                <option value="1.75"></option>-->
                                <!--                                <option value="2.0"></option>-->
                                <!--                                <option value="2.25"></option>-->
                                <option label="2.5x" value="2.5"></option>
                            </datalist>
                        </label>
                    </td>
                    <td>
                        <table>
                            <tr>
                                <td>
                                    <button>↖</button>
                                </td>
                                <td>
                                    <button>↑</button>
                                </td>
                                <td>
                                    <button>↗</button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button>←</button>
                                </td>
                                <td>
                                    <button>∙</button>
                                </td>
                                <td>
                                    <button>→</button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button>↙</button>
                                </td>
                                <td>
                                    <button>↓</button>
                                </td>
                                <td>
                                    <button>↘</button>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
        <div :style="{transform: `scale(${scale})`}" @click.stop="active = null" class="flowchart">
            <template v-for="(element, index) in flowchart">
                <Node :index="index" :key="index" @link="createLink" @move="componentMove" ref="Component"></Node>
            </template>
        </div>
        <div class="links">
            <Link :key="index" :points="link.points" v-for="(link, index) in links"/>
        </div>
    </div>
</template>

<script>
    import Node from "@/components/flowchart/graph/Node";
    import Link from "@/components/flowchart/graph/Link";

    export default {
        name: "Graph",

        components: {
            Node,
            Link
        },

        mounted: function () {
            this.name = function (type) {
                switch (type) {
                    case 'Scene':
                        return 'Сцена';

                    case 'End':
                        return 'Конец';
                }
            };
        },

        data: function () {
            return {
                position: [0, 0]
            }
        },

        computed: {
            flowchart: function () {
                return this.$store.getters['flowchart/nodes'];
            },

            links: function () {
                return this.$store.getters['flowchart/links'];
            },

            active: {
                get: function () {
                    return this.$store.getters['flowchart/active'];
                },

                set: function (value) {
                    this.$store.commit('flowchart/UPDATE_ACTIVE', value)
                }
            },

            scale: {
                get: function () {
                    return this.$store.getters['flowchart/scale'];
                },

                set: function (value) {
                    this.$store.commit('flowchart/UPDATE_SCALE', value)
                }
            },
        },

        methods: {
            drop: function (e) {
                let data = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');

                if (this.name(data.type) != null) {
                    this.$store.dispatch('flowchart/add_node', {
                        type: data.type,
                        name: this.name(data.type),
                        x: e.layerX - data.offsetX,
                        y: e.layerY - data.offsetY,
                        w: 300,
                        h: 150,
                    });
                }
            },

            // TODO: It has lots of bugs so I'll back later.
            // wheel: function (e) {
            // this.scale += e.deltaY / 2000;
            // if (this.scale < 0.1) this.scale = 0.1;
            // else if (this.scale > 2.5) this.scale = 2.5;
            // },

            componentMove: function (e) {
                for (let index in this.links) {
                    if (this.links.hasOwnProperty(index)) {
                        let link = this.links[index];
                        if (link.startNode === e.index) {
                            link.points = Object.assign(link.points, {
                                x1: (e.points[link.startPoint].x + e.x),
                                y1: (e.points[link.startPoint].y + e.y)
                            });
                        }
                        if (link.endNode === e.index) {
                            link.points = Object.assign(link.points, {
                                x2: (e.points[link.endPoint].x + e.x),
                                y2: (e.points[link.endPoint].y + e.y)
                            });
                        }

                        this.$store.commit('flowchart/UPDATE_LINK', {index, link});
                    }
                }
            },

            createLink: function (e) {
                if (e.one) {
                    for (let index in this.links) {
                        if (this.links.hasOwnProperty(index)) {
                            let link = this.links[index];
                            if (link.startNode === e.startNode || link.endNode === e.endNode) {
                                this.$store.commit('flowchart/REMOVE_LINK', index);

                                return this.createLink(e);
                            }
                        }
                    }
                }

                e.points.x1 += this.flowchart[e.startNode].x;
                e.points.y1 += this.flowchart[e.startNode].y;
                e.points.x2 += this.flowchart[e.endNode].x;
                e.points.y2 += this.flowchart[e.endNode].y;

                this.$store.commit('flowchart/ADD_LINK', e);
            }
        }
    }
</script>

<style lang="scss" scoped>
    div {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;

        & div {
            width: initial;
            height: initial;
            overflow: initial;
            position: initial;
        }

        .controls {
            top: 0;
            right: 0;
            z-index: 1;
            position: absolute;

            table {
                td {
                    &:first-child {
                        vertical-align: top;
                    }

                    &:last-child {
                        button {
                            width: 28px;
                            height: 23px;
                            text-align: center;
                        }
                    }
                }
            }
        }

        .flowchart {
            width: auto;
            height: auto;
            min-width: 100%;
            min-height: 100%;
            overflow: visible;
        }

        .links {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: visible;
            position: absolute;
            pointer-events: none;
        }
    }
</style>