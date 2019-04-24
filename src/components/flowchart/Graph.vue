<template>
    <div>
        <div :style="{transform: `scale(${scale})`}" class="flowchart">
            <template v-for="(element, index) in flowchart">
                <Start :index="index" :key="index" @link="createLink" @move="componentMove"
                       ref="Component" v-if="element.type === 'Start'"></Start>
                <Scene :index="index" :key="index" @link="createLink" @move="componentMove"
                       ref="Component" v-else-if="element.type === 'Scene'"></Scene>
                <End :index="index" :key="index" @link="createLink" @move="componentMove"
                     ref="Component" v-else-if="element.type === 'End'"></End>
            </template>
        </div>
        <div class="links">
            <Link :points="link.points" :style="{transform: `scale(${scale})`}" v-for="link in links"></Link>
        </div>
    </div>
</template>

<script>
    import Start from "@/components/flowchart/Start";
    import Scene from "@/components/flowchart/Scene";
    import End from "@/components/flowchart/End";
    import Link from "@/components/flowchart/Link";

    export default {
        name: "Graph",

        components: {
            Link,
            Start,
            Scene,
            End
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

            this.drop = function (e) {
                let data = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');

                if (data.type != null) {
                    this.$store.dispatch('flowchart/add_node', {
                        type: data.type,
                        name: this.name(data.type),
                        x: e.layerX - data.offsetX,
                        y: e.layerY - data.offsetY,
                        w: 300,
                        h: 150,
                    });
                }
            }.bind(this);

            this.$el.ondragover = this.$el.ondragenter = function (e) {
                e.preventDefault();
            };

            this.wheel = function (e) {
                this.scale += e.deltaY / 2000;
                if (this.scale < 0.1) this.scale = 0.1;
                else if (this.scale > 2.5) this.scale = 2.5;
            }.bind(this);

            this.$el.addEventListener('wheel', this.wheel);
            this.$el.addEventListener('drop', this.drop);
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
        },

        beforeDestroy: function () {
            this.$el.removeEventListener('wheel', this.wheel);
            this.$el.removeEventListener('drop', this.drop);
        }
    }
</script>

<style lang="scss" scoped>
    div {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;

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