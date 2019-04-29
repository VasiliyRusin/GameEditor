<template>
    <table>
        <tr>
            <td :class="{ open: settings.layout.left}">
                <button @click="settings.layout.left = !settings.layout.left" class="layout"
                        v-if="settings.layout.left">«
                </button>
                <button @click="settings.layout.left = !settings.layout.left" class="layout" v-else>»</button>
                <div>
                    <ul>
                        <li :class="{disabled: end}" :draggable="!end" :key="item"
                            @dragstart="setItem($event, item)" v-for="item in ['Scene', 'End']">
                            {{ item }}
                        </li>
                    </ul>
                    <Variables></Variables>
                </div>
            </td>
            <td>
                <Graph></Graph>
            </td>
            <td :class="{ open: settings.layout.right}">
                <button @click="settings.layout.right = !settings.layout.right" class="layout"
                        v-if="settings.layout.right">»
                </button>
                <button @click="settings.layout.right = !settings.layout.right" class="layout" v-else>«</button>
                <Properties></Properties>
            </td>
        </tr>
    </table>
</template>

<script>
    import Graph from "@/components/flowchart/graph/Graph";
    import Properties from "@/components/flowchart/Properties";
    import Variables from "@/components/flowchart/Variables";

    export default {
        name: "Flowchart",
        components: {
            Variables,
            Properties,
            Graph
        },

        data: function () {
            return {
                settings: {
                    layout: {
                        left: true,
                        right: true
                    }
                }
            }
        },

        computed: {
            end: function () {
                return this.$store.getters['flowchart/nodes'].filter((x) => x.type === 'End')[0] != null;
            }
        },

        methods: {
            setItem: function (e, type) {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                }));
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/mixins";

    table {
        table-layout: fixed;
        background-color: #42b983;

        tr {
            td {
                padding: 0;
                position: relative;
                vertical-align: top;

                &:first-child, &:last-child {
                    width: 0;
                    max-width: 200px;
                    position: relative;

                    &.open {
                        width: 20%;
                    }

                    button {
                        &.layout {
                            z-index: 2;
                            position: absolute;
                        }
                    }
                }

                &:first-child {
                    background-color: deepskyblue;

                    div {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;

                        ul {
                            margin: 0;
                            padding: 0;
                            height: 100%;
                            display: block;
                            overflow: auto;
                            list-style: none;

                            li {
                                @include non-select;

                                width: 100%;
                                padding: 20px;
                                text-align: left;
                                box-sizing: border-box;
                                background-color: white;

                                &.disabled {
                                    cursor: not-allowed;
                                    color: rgba(0, 0, 0, 0.5);
                                    background-color: whitesmoke;
                                }
                            }
                        }
                    }
                }

                &:last-child {
                    background-color: white;
                }

                /* FixMe: real strange shit with Chrome 74 */
                &:nth-child(1) {
                    .layout {
                        top: 20px;
                        left: 100%;
                    }
                }

                &:nth-child(3) {
                    .layout {
                        top: 100px;
                        left: auto;
                        right: 100%;
                    }
                }
            }
        }
    }
</style>