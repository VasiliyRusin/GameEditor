<template>
    <div class="points">
        <ul>
            <template v-for="(point, index) in points">
                <Point :index="index" :key="index" :label="point.label"
                       :node="$parent.index" :type="point.type" @link="$emit('link', $event)"
                       v-if="point.type === 'in'"></Point>
            </template>
        </ul>
        <ul>
            <template v-for="(point, index) in points">
                <Point :index="index" :key="index" :label="point.label"
                       :node="$parent.index" :type="point.type" @link="$emit('link', $event)"
                       v-if="point.type === 'out' || point.type == null"></Point>
            </template>
        </ul>
    </div>
</template>

<script>
    import Point from "@/components/flowchart/Point";

    export default {
        name: "Points",
        components: {Point},

        props: {
            points: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },

        methods: {
            positions: async function () {
                await this.$nextTick();
                return this.$children.map((o) => {
                    return {x: o.offset.left, y: o.offset.top}
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .points {
        ul {
            margin: 0;
            padding: 0;
            width: 50%;
            list-style: none;
            display: inline-block;

            &:first-child {
                text-align: left;

                .point {
                    margin-right: 5px;
                }
            }

            &:last-child {
                text-align: right;

                .point {
                    margin-left: 5px;
                }
            }
        }
    }
</style>