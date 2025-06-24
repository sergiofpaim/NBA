<template>
    <div class="layout-wrapper">
      <!-- HEADER -->
      <div class="header">
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
      </div>
  
      <!-- BODY -->
      <main class="main-content">
        <slot />
      </main>
  
      <!-- FOOTER -->
      <div class="footer">
        <p>© {{ year }} By Sérgio F. Paim</p>
      </div>
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
  
  .toolbar {
    display: flex;
    width: 100%;
    align-items: center;
  }
  
  .logo {
    height: 100px;
    padding-right: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
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
  
  .layout-wrapper {
  font-family: "Geomanist", "Helvetica", "Arial", sans-serif;
  min-height: 100vh;
  background-color: #00438C;
  color: #ffffff;
  overflow: hidden;           /* evita scrollbar geral */
  display: flex;
  flex-direction: column;
}

/* já existente, mantém header fixo */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-color: #00438C;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.733);
}

/* já existente, mantém footer fixo */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #f2f2f2;
  color: #00438C;
  text-align: center;
  line-height: 26px;         /* vertical centering do texto dentro de 50px */
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* NOVO .main-content */
.main-content {
  /* afasta do header e footer */
  margin-top: 100px;
  margin-bottom: 50px;

  /* faz exatamente 100vh menos header+footer = 100 + 50 = 150px */
  height: calc(100vh - 150px);

  /* centralização vertical e horizontal */
  display: flex;
  align-items: center;
  justify-content: center;

  /* evita scroll interno */
  overflow: hidden;

  /* mantém fundo igual */
  background-color: #00438C;
}

  </style>