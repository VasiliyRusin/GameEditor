<template>
    <table id="app">
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
    table {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: fixed;
        border-collapse: collapse;
        background-color: rebeccapurple;

        & table {
            position: static;
        }

        tr {
            &:first-child {
                height: 1%;

                nav {
                    text-align: left;

                    ul {
                        margin: 0;
                        padding: 0;
                        list-style: none;

                        li {
                            padding: 5px;
                            display: inline-block;
                            background-color: lightgray;

                            a {
                                font-weight: bold;

                                &.router-link-exact-active {
                                    color: #42b983;
                                }
                            }
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
