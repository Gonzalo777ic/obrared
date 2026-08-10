/**
 * Reglas de visibilidad de ObraRed (SEO + privacidad).
 *
 * - Perfiles de trabajadores/obreros: públicos para visitantes y buscadores.
 * - Contacto (teléfono, chat): requiere cuenta autenticada.
 * - Requerimientos de clientes (tablero de obras): públicos pero anónimos;
 *   solo especialidad, distrito, metraje y fecha. Sin nombre ni dirección exacta.
 */
export const VISIBILITY_POLICY = {
  workerProfilesPublic: true,
  contactRequiresAuth: true,
  clientRequestsPublicButAnonymous: true,
} as const;
