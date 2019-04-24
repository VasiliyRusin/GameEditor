<template>
    <div :style="{transform: `translate(${x}px, ${y}px)`, width: `${w}px`, height: `${h}px`}"
         class="component" ref="Root">
        <div class="card terminal">
            <button @click="remove()" class="remove"></button>
            <div>
                <h3>{{ name }}</h3>
            </div>
            <div class="params">
                <Points :points="points" @link="$emit('link', $event)" ref="Points"></Points>
            </div>
        </div>
    </div>
</template>

<script>
    import Points from "@/components/flowchart/Points";
    import ComponentMixin from "@/components/flowchart/ComponentMixin";

    export default {
        name: "Node",
        components: {Points},
        mixins: [ComponentMixin],
        props: {
            index: {
                type: Number,
                required: true
            }
        },

        computed: {
            Points: function () {
                return this.$refs.Points;
            }
        }
    }
</script>

<style scoped>

</style>