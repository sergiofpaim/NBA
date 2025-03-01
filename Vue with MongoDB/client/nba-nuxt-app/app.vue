<template>
  <div class="global-layout">
    <header>
      <!-- Your header, navigation, logo, etc. -->
      <nav>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/about">About</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <main>
      <!-- The NuxtPage component renders the page content -->
      <NuxtPage />
    </main>

    <footer>
      <!-- Your footer -->
      <p>© 2025 Your Company</p>
    </footer>
  </div>
</template>

<script setup>
// You can import and define any necessary components here
</script>

<style scoped>
/* Add some basic styling for your layout */
.global-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
header {
  background: #333;
  color: white;
  padding: 10px;
}
footer {
  background: #333;
  color: white;
  padding: 10px;
  margin-top: auto;
}
main {
  flex-grow: 1;
  padding: 20px;
}
</style>
