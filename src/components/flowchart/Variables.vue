<template>
    <ul class="variables">
        <li>
            <table class="variables__top">
                <tr>
                    <td>
                        <form>
                            <label>
                                <input list="variables_datalist" placeholder="Поиск" type="search" v-model="search">
                                <datalist id="variables_datalist">
                                    <option :key="index" v-for="(variable, index) in variables">
                                        {{ variable.name }}
                                    </option>
                                </datalist>
                            </label>
                        </form>
                    </td>
                    <td>
                        <label>
                            <select :disabled="cantCreate" @change.prevent="createVariable" v-model="variable">
                                <option disabled selected>+</option>
                                <option value="string">текст</option>
                                <option value="number">число</option>
                                <option value="boolean">переключатель</option>
                            </select>
                        </label>
                    </td>
                </tr>
            </table>
        </li>
        <Variable :index="parseInt(index)" :key="index" v-for="(variable, index) in filtered"></Variable>
    </ul>
</template>

<script>
    import Variable from "@/components/flowchart/Variable";

    export default {
        name: "Variables",
        components: {Variable},

        data: function () {
            return {
                search: '',
                variable: '+'
            }
        },

        computed: {
            variables: function () {
                return this.$store.getters['global/variables']
            },

            filtered: function () {
                if (this.search) {
                    let result = {};
                    this.variables.filter((o, i) => {
                        if (o.name.includes(this.search)) result[i] = o;
                    });

                    return result;
                } else return this.variables;
            },

            cantCreate: function () {
                return this.variables.find(o => (o.name == null || o.name === ''));
            }
        },

        methods: {
            createVariable: function () {
                this.$store.commit('global/ADD_VARIABLE', {
                    type: this.variable
                });

                this.variable = '+';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .variables {
        bottom: 0;
        height: 50%;
        background-color: aliceblue;

        table {
            width: 100%;

            input, button {
                width: 100%;
                box-sizing: border-box;
            }

            &.variables__top {
                td {
                    &:first-child {
                        width: 100%;
                    }

                    &:last-child {
                        select {
                            width: 30px;
                        }
                    }
                }
            }
        }
    }
</style>