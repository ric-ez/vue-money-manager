<template>
    <div class="container my-4">
        <div class="row justify-content-center">
            <!-- <span class="nav-item mx-3">Expenses</span> -->
            <router-link to="/expenses" class="nav-item mx-4">Expenses</router-link>
            <router-link to="/income" class="nav-item mx-4">Income</router-link>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .nav-item{
        font-size: 25px;
        // font-weight: bold;
        letter-spacing: 2px;
        text-decoration: none;
        color: black;
        font-family: 'Poppins', sans-serif;
        &:hover{
            color: #dc3545 !important;
            transition: 0.5s;
        }
    }
</style>
