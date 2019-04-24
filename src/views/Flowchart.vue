<template>
    <table>
        <tr>
            <td>
                <ul>
                    <li :class="{disabled: end}" :draggable="!end" :key="item"
                        @dragstart="setItem($event, item)" v-for="item in ['Scene', 'End']">
                        {{ item }}
                    </li>
                </ul>
            </td>
            <td>
                <Graph></Graph>
            </td>
            <td></td>
        </tr>
    </table>
</template>

<script>
    import Graph from "@/components/flowchart/Graph";

    export default {
        name: "Flowchart",
        components: {
            Graph
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
        background-color: #42b983;

        tr {
            td {
                padding: 0;
                vertical-align: top;

                &:first-child, &:last-child {
                    width: 20%;
                    max-width: 200px;
                }

                &:first-child {
                    background-color: deepskyblue;

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

                &:last-child {
                    width: 1px;
                    background-color: #2c3e50;
                }
            }
        }
    }
</style>