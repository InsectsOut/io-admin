import html2pdf from "html2pdf.js";

/**
 * Copia TODOS los estilos computados del DOM original
 * al DOM clonado (inline styles)
 */
function inlineComputedStyles(source: HTMLElement, target: HTMLElement) {
  const sourceElements = source.querySelectorAll("*");
  const targetElements = target.querySelectorAll("*");

  sourceElements.forEach((srcEl, i) => {
    const tgtEl = targetElements[i] as HTMLElement | undefined;
    if (!tgtEl) return;

    const computed = window.getComputedStyle(srcEl);
    let style = "";

    for (let j = 0; j < computed.length; j++) {
      const prop = computed[j];
      const value = computed.getPropertyValue(prop);

      // Evitar propiedades que rompen canvas/PDF
      if (
        prop.startsWith("animation") ||
        prop.startsWith("transition") ||
        prop === "caret-color"
      ) {
        continue;
      }

      style += `${prop}:${value};`;
    }

    tgtEl.setAttribute("style", style);
  });
}

export async function generatePdf(
  element: HTMLElement,
  fileName: string,
   heightMm: number
): Promise<Blob> {
  /**
   * 1️⃣ Clonar el HTML PRIMERO
   */
  const wrapper = document.createElement("div");
  wrapper.innerHTML = element.innerHTML;
  wrapper.style.width = "100%";
  wrapper.style.height = "auto";
  wrapper.style.background = "#ffffff";
  wrapper.style.padding = "35px";
wrapper.style.boxSizing = "border-box";
wrapper.style.width = "816px";

  /**
   * 2️⃣ Inlinear estilos computados
   */
  inlineComputedStyles(element, wrapper);

  /**
   * 3️⃣ Copiar valores de inputs / textareas
   */
  const originalInputs = element.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement
  >("input, textarea");

  const clonedInputs = wrapper.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement
  >("input, textarea");

  originalInputs.forEach((orig, index) => {
    const clone = clonedInputs[index];
    if (clone) {
      clone.value = orig.value;
    }
  });

  /**
   * 4️⃣ Ajustes finales PDF-safe
   */
  wrapper.querySelectorAll("*").forEach((el) => {
    const htmlEl = el as HTMLElement;

    if (htmlEl.tagName === "SVG" || htmlEl.classList.contains("icon")) return;

    htmlEl.style.maxHeight = "none";
    htmlEl.style.wordBreak = "break-word";
    htmlEl.style.whiteSpace = "normal";
  });

  /**
   * 5️⃣ Evitar canvas tainted por imágenes
   */
  wrapper.querySelectorAll("img").forEach((img) => {
    img.setAttribute("crossorigin", "anonymous");
  });

  /**
   * 6️⃣ Generar PDF
   */
 return new Promise<Blob>((resolve, reject) => {
  html2pdf()
    .set({
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 4,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "mm",
         format: [216, heightMm],
        orientation: "portrait",
      },
    
    })
    .from(wrapper)
    .output("blob")
    .then((blob: Blob) => resolve(blob))
    .catch((err: any) => reject(err));
  });
}
