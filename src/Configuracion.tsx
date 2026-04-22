import { useState, useEffect } from "react";
import styled from "styled-components";
import { supabase } from "./utils/ClientSupabase";
import { useBrandTheme } from "./utils/ThemeContext";
import { useToast } from "./rehusableComponents/Toast";
import { FaPaintBrush } from "react-icons/fa";

// ── Paletas predefinidas ──────────────────────────────────────────────────────

interface Palette {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
}

const PALETTES: Palette[] = [
    { name: "Océano", primary: "#0d4e80", secondary: "#e74c3c", accent: "#eef5fb" },
    { name: "Bosque", primary: "#1e6b45", secondary: "#e67e22", accent: "#edfaf1" },
    { name: "Violeta", primary: "#5b3a8e", secondary: "#e74c3c", accent: "#f3eeff" },
    { name: "Pizarra", primary: "#2c3e50", secondary: "#e74c3c", accent: "#eaecee" },
    { name: "Carbón", primary: "#212121", secondary: "#f44336", accent: "#f5f5f5" },
    { name: "Terracota", primary: "#8b3a2a", secondary: "#2980b9", accent: "#fdf0ed" },
    { name: "Índigo", primary: "#3949ab", secondary: "#e53935", accent: "#eef0fb" },
    { name: "Olivo", primary: "#5c6a00", secondary: "#c0392b", accent: "#f5f7e8" },
];

// ── Styled components ────────────────────────────────────────────────────────

const PageContainer = styled.div`
    padding: 2rem;
    max-width: 680px;
    margin: 0 auto;
    color: #333;
    @media (max-width: 600px) {
        padding: 1rem;
    }
`;

const PageTitle = styled.h1`
    color: ${({ theme }) => theme.primaryColor};
    font-size: 1.8rem;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
`;

const PageSubtitle = styled.p`
    color: #888;
    font-size: 0.9rem;
    margin: 0 0 2rem 0;
`;

const Section = styled.section`
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
    font-size: 0.8rem;
    font-weight: 700;
    color: #999;
    margin: 0 0 1.25rem 0;
    text-transform: uppercase;
    letter-spacing: 0.06em;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1.1rem;
`;

const Label = styled.label`
    font-size: 0.875rem;
    font-weight: 600;
    color: #444;
`;

const TextInput = styled.input`
    padding: 0.55rem 0.75rem;
    border: 1.5px solid #dde3ea;
    border-radius: 0.4rem;
    font-size: 0.95rem;
    outline: none;
    &:focus {
        border-color: ${({ theme }) => theme.primaryColor};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.accentColor};
    }
`;

const ColorRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.65rem;
`;

const ColorSwatch = styled.div<{ $color: string }>`
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    border: 2px solid rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    transition: background 0.2s;
`;

const NativeColorPicker = styled.input`
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    background: none;
    flex-shrink: 0;
`;

const HexInput = styled.input`
    padding: 0.4rem 0.65rem;
    border: 1.5px solid #dde3ea;
    border-radius: 0.4rem;
    font-size: 0.9rem;
    width: 7.5rem;
    font-family: monospace;
    outline: none;
    &:focus {
        border-color: ${({ theme }) => theme.primaryColor};
    }
`;

const PreviewContainer = styled.div`
    display: flex;
    gap: 0.6rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
`;

const PreviewChip = styled.div<{ $bg: string; $fg?: string }>`
    background: ${({ $bg }) => $bg};
    color: ${({ $fg }) => $fg ?? "white"};
    padding: 0.45rem 1rem;
    border-radius: 0.4rem;
    font-size: 0.82rem;
    font-weight: 600;
    transition: background 0.2s;
`;

const PreviewLabel = styled.span`
    font-size: 0.75rem;
    color: #aaa;
`;

const SaveButton = styled.button`
    background: ${({ theme }) => theme.primaryColor};
    color: white;
    border: none;
    padding: 0.75rem 2.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
    &:hover:not(:disabled) {
        opacity: 0.85;
    }
    &:disabled {
        background: #aaa;
        cursor: not-allowed;
    }
`;

const AccessDenied = styled.div`
    text-align: center;
    padding: 5rem 2rem;
    color: #aaa;
    font-size: 1rem;
`;

// ── Paletas UI ────────────────────────────────────────────────────────────────

const PaletteGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
`;

const PaletteCard = styled.button<{ $active: boolean }>`
    all: unset;
    border-radius: 0.6rem;
    padding: 0.6rem 0.5rem 0.5rem;
    border: 2px solid ${({ $active }) => ($active ? "#333" : "transparent")};
    background: ${({ $active }) => ($active ? "#f0f4fa" : "#fafafa")};
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    transition:
        border-color 0.15s,
        background 0.15s;
    &:hover {
        border-color: #aaa;
    }
`;

const PaletteSwatches = styled.div`
    display: flex;
    border-radius: 0.35rem;
    overflow: hidden;
    width: 100%;
    height: 1.6rem;
`;

const PaletteSwatch = styled.div<{ $color: string }>`
    flex: 1;
    background: ${({ $color }) => $color};
`;

const PaletteName = styled.span`
    font-size: 0.72rem;
    font-weight: 600;
    color: #555;
    text-align: center;
`;

// ── Sub-componente ColorField ─────────────────────────────────────────────────

const isValidHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

interface ColorFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange }) => (
    <Field>
        <Label>{label}</Label>
        <ColorRow>
            <NativeColorPicker
                type="color"
                value={isValidHex(value) ? value : "#000000"}
                onChange={e => onChange(e.target.value)}
            />
            <ColorSwatch $color={isValidHex(value) ? value : "#cccccc"} />
            <HexInput value={value} onChange={e => onChange(e.target.value)} placeholder="#0d4e80" maxLength={7} />
        </ColorRow>
    </Field>
);

// ── Componente principal ──────────────────────────────────────────────────────

import React from "react";

const Configuracion: React.FC = () => {
    const { theme, reloadTheme } = useBrandTheme();
    const { showToast } = useToast();

    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
    const [saving, setSaving] = useState(false);
    const [activePalette, setActivePalette] = useState<string | null>(null);

    // Estado del formulario (inicializado con el tema actual)
    const [primary, setPrimary] = useState(theme.primaryColor);
    const [secondary, setSecondary] = useState(theme.secondaryColor);
    const [accent, setAccent] = useState(theme.accentColor);
    const [nombreEmpresa, setNombreEmpresa] = useState(theme.nombreEmpresa ?? "");
    const [logoUrl, setLogoUrl] = useState(theme.logoUrl ?? "");

    // Cuando el usuario elige una paleta, aplica los 3 colores
    const applyPalette = (palette: Palette) => {
        setPrimary(palette.primary);
        setSecondary(palette.secondary);
        setAccent(palette.accent);
        setActivePalette(palette.name);
    };

    // Si el usuario edita manualmente un color, quitar paleta activa
    const handlePrimaryChange = (v: string) => {
        setPrimary(v);
        setActivePalette(null);
    };
    const handleSecondaryChange = (v: string) => {
        setSecondary(v);
        setActivePalette(null);
    };
    const handleAccentChange = (v: string) => {
        setAccent(v);
        setActivePalette(null);
    };

    // Sincronizar si el tema cambia tras la carga inicial
    useEffect(() => {
        setPrimary(theme.primaryColor);
        setSecondary(theme.secondaryColor);
        setAccent(theme.accentColor);
        setNombreEmpresa(theme.nombreEmpresa ?? "");
        setLogoUrl(theme.logoUrl ?? "");
        // Detectar qué paleta coincide con el tema actual
        const match = PALETTES.find(
            p =>
                p.primary === theme.primaryColor &&
                p.secondary === theme.secondaryColor &&
                p.accent === theme.accentColor
        );
        setActivePalette(match?.name ?? null);
    }, [theme.primaryColor, theme.secondaryColor, theme.accentColor]);

    // Verificar que el usuario sea superadmin
    useEffect(() => {
        const checkRole = async () => {
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                setIsSuperAdmin(false);
                return;
            }
            const { data } = await supabase.from("Empleados").select("tipo_rol").eq("user_id", userId).maybeSingle();

            setIsSuperAdmin(data?.tipo_rol === "superadmin");
        };
        checkRole();
    }, []);

    const handleSave = async () => {
        if (!isValidHex(primary) || !isValidHex(secondary) || !isValidHex(accent)) {
            showToast("Uno o más colores tienen formato inválido (usa #rrggbb)", "error");
            return;
        }
        const org = localStorage.getItem("org");
        if (!org) {
            showToast("No se encontró la organización", "error");
            return;
        }
        setSaving(true);
        const { error } = await supabase.from("OrganizacionConfig").upsert(
            {
                organizacion: org,
                primary_color: primary,
                secondary_color: secondary,
                accent_color: accent,
                nombre_empresa: nombreEmpresa.trim() || null,
                logo_url: logoUrl.trim() || null,
            },
            { onConflict: "organizacion" }
        );

        if (error) {
            showToast("Error al guardar: " + error.message, "error");
        } else {
            showToast("Configuración guardada correctamente", "success");
            reloadTheme();
        }
        setSaving(false);
    };

    // Cargando
    if (isSuperAdmin === null) return null;

    // Sin permiso
    if (!isSuperAdmin) {
        return <AccessDenied>No tienes permisos para acceder a esta sección.</AccessDenied>;
    }

    return (
        <PageContainer>
            <PageTitle>
                <FaPaintBrush size={22} />
                Configuración de marca
            </PageTitle>
            <PageSubtitle>Los cambios se aplican en toda la app al guardar.</PageSubtitle>

            {/* Empresa */}
            <Section>
                <SectionTitle>Empresa</SectionTitle>
                <Field>
                    <Label>Nombre de la empresa</Label>
                    <TextInput
                        value={nombreEmpresa}
                        onChange={e => setNombreEmpresa(e.target.value)}
                        placeholder="Ej: Control de Plagas S.A."
                    />
                </Field>
                <Field>
                    <Label>URL del logo</Label>
                    <TextInput
                        value={logoUrl}
                        onChange={e => setLogoUrl(e.target.value)}
                        placeholder="https://..."
                        type="url"
                    />
                </Field>
            </Section>

            {/* Colores */}
            <Section>
                <SectionTitle>Paletas de colores</SectionTitle>
                <PaletteGrid>
                    {PALETTES.map(palette => (
                        <PaletteCard
                            key={palette.name}
                            $active={activePalette === palette.name}
                            onClick={() => applyPalette(palette)}
                            title={palette.name}
                        >
                            <PaletteSwatches>
                                <PaletteSwatch $color={palette.primary} />
                                <PaletteSwatch $color={palette.secondary} />
                                <PaletteSwatch $color={palette.accent} />
                            </PaletteSwatches>
                            <PaletteName>{palette.name}</PaletteName>
                        </PaletteCard>
                    ))}
                </PaletteGrid>

                <SectionTitle>Ajuste fino</SectionTitle>
                <ColorField
                    label="Color primario (botones, títulos, bordes)"
                    value={primary}
                    onChange={handlePrimaryChange}
                />
                <ColorField
                    label="Color secundario (eliminar, alertas)"
                    value={secondary}
                    onChange={handleSecondaryChange}
                />
                <ColorField label="Color de acento (fondos claros)" value={accent} onChange={handleAccentChange} />

                {/* Vista previa */}
                <PreviewContainer>
                    <PreviewLabel>Vista previa:</PreviewLabel>
                    <PreviewChip $bg={primary}>Primario</PreviewChip>
                    <PreviewChip $bg={secondary}>Secundario</PreviewChip>
                    <PreviewChip $bg={accent} $fg={primary}>
                        Acento
                    </PreviewChip>
                </PreviewContainer>
            </Section>

            <SaveButton onClick={handleSave} disabled={saving}>
                {saving ? "Guardando…" : "Guardar cambios"}
            </SaveButton>
        </PageContainer>
    );
};

export default Configuracion;

