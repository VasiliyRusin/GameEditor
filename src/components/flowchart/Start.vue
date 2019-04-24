<template>
    <div :style="{transform: `translate(${x}px, ${y}px)`, width: `${w}px`, height: `${h}px`}" class="component"
         ref="Root">
        <div class="card terminal">
            <div>
                <h3 class="title">{{ name }}</h3>
                <div class="params">
                    <Points :points="points" ref="Points"></Points>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ComponentMixin from './ComponentMixin';
    import Points from "@/components/flowchart/Points";

    export default {
        name: "Scene",
        components: {
            Points
        },
        mixins: [
            ComponentMixin
        ],

        data: function () {
            return {}
        },

        methods: {
            remove: function () {
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../scss/mixins";
    @import "scss/component";

    div {
        @include non-select;
        @include component;

        & > .card {
            @include terminal;

            button {
                @include remove;
            }
        }
    }
</style>