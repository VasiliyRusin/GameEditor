<template>
    <table class="root" id="app">
        <tr>
            <td>
                <header>
                    <nav>
                        <ul>
                            <li>
                                <router-link to="/">Home</router-link>
                            </li>
                            <li>
                                <router-link to="/about">About</router-link>
                            </li>
                            <li>
                                <router-link to="/flowchart">Flowchart</router-link>
                            </li>
                        </ul>
                        <button @click="toggleFullscreen()" class="fullscreen">&nbsp;</button>
                    </nav>
                </header>
            </td>
        </tr>
        <tr>
            <td>
                <router-view/>
            </td>
        </tr>
    </table>
</template>

<script>
    export default {
        name: "App",

        data: function () {
            return {}
        },

        methods: {
            toggleFullscreen: function () {
                if (!document.fullscreenElement) {
                    this.$el.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
        }
    }
</script>

<style lang="scss">
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }

    @for $index from 1 through 6 {
        h#{$index} {
            text-align: center;
        }
    }
</style>

<style lang="scss" scoped>
    @import "scss/functions";

    table {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        background-color: rebeccapurple;

        &.root {
            position: fixed;
        }

        &:fullscreen {
            tr {
                &:first-child {
                    nav {
                        button {
                            &.fullscreen {
                                background-image: url("./assets/flowchart/minimize.svg") !important;
                            }
                        }
                    }
                }
            }
        }

        tr {
            &:first-child {
                height: 1%;

                nav {
                    text-align: left;

                    li, button {
                        padding: 5px;
                        min-width: rem(29px);
                        min-height: rem(19px);
                        display: inline-block;
                        border-color: lightgray;
                        background-color: lightgray;
                    }

                    ul {
                        margin: 0;
                        padding: 0;
                        list-style: none;
                        display: inline-block;

                        li {
                            a {
                                font-weight: bold;

                                &.router-link-exact-active {
                                    color: #42b983;
                                }
                            }
                        }
                    }

                    button {
                        float: right;
                        border: none;
                        font-size: inherit;

                        &.fullscreen {
                            background-size: 60%;
                            background-position: center;
                            background-repeat: no-repeat;
                            background-image: url("./assets/flowchart/maximize.svg");
                        }
                    }
                }
            }

            td {
                padding: 0;
                vertical-align: top;
            }
        }
    }
</style>
