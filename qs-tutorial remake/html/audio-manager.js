/**
 * QS-Tutorial Audio Manager
 * Sistema de audio automático para 6 escenas del tutorial
 * Compatible con FiveM NUI - JavaScript puro
 */

(function () {
    'use strict';

    // Configuración
    const CONFIG = {
        soundsPath: 'sounds/',
        totalScenes: 6,
        defaultVolume: 0.6,
        fileExtension: '.mp3',
        debug: true // Activar modo debug
    };

    // Mapeo de imágenes únicas a números de escena.
    // 'talk3.png' se usa en escenas 1 y 4, por lo que se maneja con lógica especial.
    const IMAGE_TO_SCENE_MAP = {
        'rose.png': 2,      // Escena 2
        'point.png': 3,     // Escena 3
        'talk2.png': 5,     // Escena 5
        'marry.png': 6      // Escena 6
    };

    // Estado del sistema de audio
    let audioElement = null;
    let currentScene = null;
    let isInitialized = false;

    /**
     * Log de debug
     */
    function debugLog(...args) {
        if (CONFIG.debug) {
            console.log('[Audio Manager DEBUG]', ...args);
        }
    }

    /**
     * Inicializa el sistema de audio
     */
    function initAudioSystem() {
        if (isInitialized) return;

        debugLog('Iniciando sistema de audio...');

        // Obtener el elemento de audio del DOM
        audioElement = document.getElementById('sceneAudio');

        if (!audioElement) {
            console.error('[Audio Manager] No se encontró el elemento <audio id="sceneAudio">');
            return;
        }

        // Configurar volumen por defecto
        audioElement.volume = CONFIG.defaultVolume;

        // Manejar errores de carga de audio
        audioElement.addEventListener('error', function (e) {
            console.error('[Audio Manager] Error al cargar audio:', audioElement.src, e);
        });

        // Eventos de audio para debugging
        audioElement.addEventListener('loadstart', () => debugLog('Audio: loadstart'));
        audioElement.addEventListener('loadeddata', () => debugLog('Audio: loadeddata'));
        audioElement.addEventListener('canplay', () => debugLog('Audio: canplay'));
        audioElement.addEventListener('play', () => debugLog('Audio: play event'));
        audioElement.addEventListener('playing', () => debugLog('Audio: playing'));
        audioElement.addEventListener('pause', () => debugLog('Audio: pause'));
        audioElement.addEventListener('ended', () => debugLog('Audio: ended'));

        isInitialized = true;
        console.log('[Audio Manager] Sistema de audio inicializado correctamente');
        debugLog('Volumen configurado a:', CONFIG.defaultVolume);
    }

    /**
     * Detiene el audio actual y resetea el tiempo
     */
    function stopCurrentAudio() {
        if (!audioElement) return;

        try {
            audioElement.pause();
            audioElement.currentTime = 0;
            debugLog('Audio detenido y reseteado');
        } catch (error) {
            console.warn('[Audio Manager] Error al detener audio:', error);
        }
    }

    /**
     * Reproduce el audio de una escena específica
     * @param {number} sceneNumber - Número de escena (1-6)
     */
    function playSceneAudio(sceneNumber) {
        console.log('[Audio Manager] playSceneAudio llamado con escena:', sceneNumber);

        if (!audioElement || !isInitialized) {
            console.warn('[Audio Manager] Sistema de audio no inicializado');
            return;
        }

        // Validar número de escena
        if (sceneNumber < 1 || sceneNumber > CONFIG.totalScenes) {
            console.warn('[Audio Manager] Número de escena inválido:', sceneNumber);
            return;
        }

        // Si es la misma escena, no hacer nada
        if (currentScene === sceneNumber) {
            debugLog('Ya está reproduciendo escena', sceneNumber);
            return;
        }

        // Detener audio anterior
        stopCurrentAudio();

        // Construir ruta del nuevo audio
        const audioPath = CONFIG.soundsPath + 'scene' + sceneNumber + CONFIG.fileExtension;
        console.log('[Audio Manager] Intentando cargar:', audioPath);

        // Actualizar fuente y reproducir
        audioElement.src = audioPath;

        // Intentar reproducir
        const playPromise = audioElement.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentScene = sceneNumber;
                    console.log('[Audio Manager] ✅ Reproduciendo audio de escena', sceneNumber);
                })
                .catch(error => {
                    console.error('[Audio Manager] ❌ No se pudo reproducir audio de escena', sceneNumber, ':', error);
                });
        }
    }

    /**
     * Detiene todo el audio (para cuando se cierra el tutorial)
     */
    function stopAllAudio() {
        stopCurrentAudio();
        currentScene = null;
        console.log('[Audio Manager] Audio detenido completamente');
    }

    /**
     * Lógica para resolver ambigüedad de escenas con la misma imagen (talk3.png)
     * @param {string} imageFileName - Nombre del archivo de imagen
     * @param {number} currentScene - Escena actual
     * @returns {number} Número de escena resuelto (1 o 4 para talk3.png)
     */
    function resolveSceneFromImage(imageFileName, currentScene) {
        // Caso especial: talk3.png se usa en Escena 1 y Escena 4
        if (imageFileName === 'talk3.png') {
            // Si venimos de la escena 3 o 5, es la escena 4
            // También si ya estamos en la 4 y se refresca
            if (currentScene === 3 || currentScene === 5 || currentScene === 4) {
                return 4;
            }
            // En cualquier otro caso (inicio, o venimos de la 2), es la escena 1
            return 1;
        }

        // Para el resto de imágenes, usar el mapa directo
        if (IMAGE_TO_SCENE_MAP.hasOwnProperty(imageFileName)) {
            return IMAGE_TO_SCENE_MAP[imageFileName];
        }

        return null;
    }

    /**
     * Maneja los mensajes de window para detectar cambios de escena
     * @param {MessageEvent} event - Evento de mensaje
     */
    function handleWindowMessage(event) {
        // Log de TODOS los mensajes para debugging
        if (event.data && event.data.action) {
            debugLog('Mensaje recibido:', event.data.action, event.data);
        }

        if (!event.data || !event.data.action) return;

        const action = event.data.action;
        const data = event.data;

        switch (action) {
            case 'showTutorial':
                // Cuando se muestra el tutorial, reproducir escena 1
                console.log('[Audio Manager] 🎬 Tutorial iniciado - reproduciendo escena 1');
                currentScene = null; // Resetear tracking
                playSceneAudio(1);
                break;

            case 'updateTutorial':
                // Cuando se actualiza el tutorial, detectar el número de escena
                console.log('[Audio Manager] 🔄 updateTutorial recibido, data:', data);

                if (data.image) {
                    debugLog('Imagen detectada:', data.image);

                    // Extraer el nombre del archivo de la ruta completa
                    const imagePath = data.image;
                    const imageFileName = imagePath.split('/').pop(); // Obtener solo el nombre del archivo

                    debugLog('Nombre de archivo extraído:', imageFileName);

                    // Resolver escena usando lógica inteligente
                    const sceneNumber = resolveSceneFromImage(imageFileName, currentScene);

                    if (sceneNumber !== null) {
                        console.log('[Audio Manager] 🎵 Cambiando a escena', sceneNumber, '(imagen:', imageFileName + ')');
                        playSceneAudio(sceneNumber);
                    } else {
                        console.warn('[Audio Manager] ⚠️ Imagen no mapeada:', imageFileName);
                        debugLog('Imágenes mapeadas:', Object.keys(IMAGE_TO_SCENE_MAP), '+ talk3.png');
                    }
                }
                break;

            case 'hideTutorial':
                // Cuando se oculta el tutorial, detener todo el audio
                console.log('[Audio Manager] 🛑 Tutorial cerrado - deteniendo audio');
                stopAllAudio();
                break;

            case 'resetTutorial':
                // Si hay un reset, volver a escena 1
                console.log('[Audio Manager] 🔄 Tutorial reseteado');
                stopAllAudio();
                break;

            default:
                debugLog('Acción no manejada:', action);
        }
    }

    /**
     * Hook para interceptar eventos de window
     */
    function setupEventHooks() {
        debugLog('Configurando hooks de eventos...');

        // Agregar listener directo para capturar mensajes
        window.addEventListener('message', handleWindowMessage);

        console.log('[Audio Manager] Event hooks configurados');
    }

    /**
     * Inicialización cuando el DOM esté listo
     */
    function init() {
        debugLog('Init llamado, readyState:', document.readyState);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                debugLog('DOMContentLoaded disparado');
                initAudioSystem();
                setupEventHooks();
            });
        } else {
            initAudioSystem();
            setupEventHooks();
        }
    }

    // Exponer funciones globales (por si se necesitan manualmente)
    window.AudioManager = {
        play: playSceneAudio,
        stop: stopAllAudio,
        init: initAudioSystem,
        debug: function () {
            console.log('Estado del Audio Manager:');
            console.log('- Inicializado:', isInitialized);
            console.log('- Escena actual:', currentScene);
            console.log('- Audio element:', audioElement);
            console.log('- Audio src:', audioElement ? audioElement.src : 'N/A');
            console.log('- Audio paused:', audioElement ? audioElement.paused : 'N/A');
            console.log('- Audio volume:', audioElement ? audioElement.volume : 'N/A');
        }
    };

    // Iniciar el sistema
    init();

    // Log de confirmación
    console.log('[Audio Manager] Script cargado y ejecutado');

})();
