<template>
    <div class="layout-wrapper">
      <!-- HEADER -->
      <header class="header">
        <div class="toolbar">
          <img src="/images/logo.png" alt="Logomark" class="logo" />
          <div class="title-area">
            <h1 class="title">NBA Analytics</h1>
  
            <!-- BREADCRUMBS -->
            <nav v-if="breadcrumb?.length" class="breadcrumbs">
              <template v-for="(item, index) in breadcrumb" :key="index">
                <a @click.prevent="navigate(item.route)" class="breadcrumb-link">{{ item.title }}</a>
                <span v-if="index < breadcrumb.length - 1" class="breadcrumb-separator">›</span>
              </template>
            </nav>
          </div>
        </div>
      </header>
  
      <!-- BODY -->
      <main class="main-content">
        <slot />
      </main>
  
      <!-- FOOTER -->
      <footer class="footer">
        <p>© {{ year }} By Sérgio F. Paim</p>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const year = new Date().getFullYear()
  
  // Breadcrumbs (exemplo fixo por enquanto)
  const breadcrumb = ref([
    { title: 'Home', route: '/' },
    { title: 'Record', route: '/record' }
  ])
  
  const router = useRouter()
  
  function navigate(route) {
    router.push(route)
  }
  </script>
  
  <style scoped>
  /* Font Family Global */
  .layout-wrapper {
    font-family: "Geomanist", "Helvetica", "Arial", sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #00438C;
    color: #ffffff;
    overflow: hidden;
  }
  
  /* HEADER */
  .header {
    background-color: #00438C;
    height: 100px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin-top: 5px;
  }
  
  .toolbar {
    display: flex;
    width: 100%;
    align-items: center;
  }
  
  .logo {
    height: 100px;
    padding-right: 20px;
  }
  
  .title-area {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    padding-top: 8px;
    color: #ffffff;
  }
  
  .breadcrumbs {
    margin-top: 8px;
    font-weight: 700;
    color: #ffffff;
    font-size: 1rem;
  }
  
  .breadcrumb-link {
    cursor: pointer;
    color: #ffffff;
    text-decoration: none;
    margin-right: 8px;
  }
  
  .breadcrumb-separator {
    margin-right: 8px;
    color: #ffffff;
  }
  
  /* MAIN CONTENT */
  .main-content {
    flex: 1;
    padding: 24px;
    background-color: #00438C;
  }
  
  /* FOOTER */
  .footer {
    background: #f2f2f2;
    color: #00438C;
    text-align: center;
    padding: 12px;
    border-top: 2px solid #595959;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  </style>