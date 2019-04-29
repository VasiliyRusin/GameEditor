<template>
    <li v-if="type">
        <form>
            <table>
                <tr>
                    <td>
                        <label>
                            <input :class="{ error: !validateName(name) }" autofocus="autofocus"
                                   placeholder="Имя перменной"
                                   type="text" v-model="name">
                        </label>
                    </td>
                    <td>
                        <label>
                            <input :class="{ error: !validateValue(value) }" :type="type"
                                   placeholder="Значение" v-model="value">
                        </label>
                    </td>
                    <td>
                        <button :disabled="!isValid()" @click.stop="update_variable" type="button" v-if="changed">V
                        </button>
                        <button @click.stop="remove_variable" type="button" v-else>X</button>
                    </td>
                </tr>
            </table>
        </form>
    </li>
    <li v-else>
        11 {{ type }}
    </li>
</template>

<script>
    import {booleanValidator, numberValidator, stringValidator} from './validators';

    export default {
        name: "Variable",
        props: {
            index: {
                type: Number,
                required: true
            }
        },

        created: function () {
            this.name = this.variable.name;
            this.value = this.variable.value;
        },

        data: function () {
            return {
                name: '',
                value: ''
            }
        },

        computed: {
            variables: function () {
                return this.$store.getters['global/variables'];
            },

            variable: function () {
                return this.$store.getters['global/variables'][this.index];
            },

            type: function () {
                switch (this.variable.type) {
                    case 'string':
                        return 'text';

                    case 'number':
                        return 'number';

                    case 'boolean':
                        return 'checkbox';

                    default:
                        return null;
                }
            },

            changed: function () {
                return (this.name !== this.variable.name || this.value !== this.variable.value)
            }
        },

        methods: {
            remove_variable: function () {
                this.$store.commit('global/REMOVE_VARIABLE', this.index);
            },

            update_variable: function () {
                this.$store.commit('global/UPDATE_VARIABLE', {
                    index: this.index,
                    variable: {
                        name: this.name,
                        value: this.value
                    }
                });
            },

            isValid: function () {
                return this.validateName(this.name) && this.validateValue(this.value);
            },

            validateName: function (name) {
                let variables = this.variables.filter((o, i) => {
                    if (i !== this.index && o.name === name) return o
                });
                return /^[A-Za-z]+[A-Za-z0-9]*$/.test(name) && name != null && variables.length < 1;

            },

            validateValue: function (value) {
                switch (this.variable.type) {
                    case 'string':
                        return stringValidator(value);

                    case 'number':
                        return numberValidator(value);

                    case 'boolean':
                        log(value);
                        return booleanValidator(value);

                    default:
                        return false;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    table {
        width: 100%;

        td {
            &:last-child {
                $width: 30px;

                width: $width;
                text-align: right;

                button {
                    width: $width;
                    text-align: center;
                }
            }

            input {
                &:not([type="checkbox"]) {
                    width: 100%;
                    box-sizing: border-box;
                }

                &.error {
                    border-color: red !important;
                }
            }
        }
    }
</style>