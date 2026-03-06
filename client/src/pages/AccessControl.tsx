import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShieldCheck, Save, Info } from "lucide-react";

// Funções disponíveis no sistema
const ROLES = [
  { key: "administrativo", label: "Administrativo", color: "bg-blue-100 text-blue-800" },
  { key: "encarregado", label: "Encarregado", color: "bg-purple-100 text-purple-800" },
  { key: "mecanico", label: "Mecânico", color: "bg-orange-100 text-orange-800" },
  { key: "motosserrista", label: "Motosserrista", color: "bg-red-100 text-red-800" },
  { key: "carregador", label: "Carregador", color: "bg-yellow-100 text-yellow-800" },
  { key: "operador", label: "Operador", color: "bg-green-100 text-green-800" },
  { key: "motorista", label: "Motorista", color: "bg-teal-100 text-teal-800" },
  { key: "terceirizado", label: "Terceirizado", color: "bg-gray-100 text-gray-800" },
];

// Módulos do sistema com descrição
const MODULES = [
  { key: "colaboradores", label: "Colaboradores", desc: "Ficha e cadastro de colaboradores" },
  { key: "presenca", label: "Presença Biométrica", desc: "Registro de presença por reconhecimento facial" },
  { key: "presencas_lista", label: "Relatório de Presenças", desc: "Visualizar lista de presenças registradas" },
  { key: "setores_equipamentos", label: "Setores & Equipamentos", desc: "Gerenciar setores e equipamentos" },
  { key: "controle_acesso", label: "Controle de Acesso", desc: "Configurar permissões de acesso" },
];

// Permissões padrão por função (usadas quando não há configuração salva)
const DEFAULT_PERMISSIONS: Record<string, Record<string, boolean>> = {
  administrativo: { colaboradores: true, presenca: true, presencas_lista: true, setores_equipamentos: true, controle_acesso: true },
  encarregado: { colaboradores: false, presenca: true, presencas_lista: true, setores_equipamentos: false, controle_acesso: false },
  mecanico: { colaboradores: false, presenca: false, presencas_lista: false, setores_equipamentos: true, controle_acesso: false },
  motosserrista: { colaboradores: false, presenca: false, presencas_lista: false, setores_equipamentos: false, controle_acesso: false },
  carregador: { colaboradores: false, presenca: false, presencas_lista: false, setores_equipamentos: false, controle_acesso: false },
  operador: { colaboradores: false, presenca: false, presencas_lista: false, setores_equipamentos: false, controle_acesso: false },
  motorista: { colaboradores: false, presenca: false, presencas_lista: false, setores_equipamentos: false, controle_acesso: false },
  terceirizado: { colaboradores: false, presenca: false, presencas_lista: false, setores_equipamentos: false, controle_acesso: false },
};

export default function AccessControl() {
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(DEFAULT_PERMISSIONS);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const toggle = (role: string, module: string) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: !prev[role]?.[module],
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simula salvamento (backend RBAC será implementado na próxima fase)
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success("Permissões salvas com sucesso!");
  };

  const setAllForRole = (role: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [role]: Object.fromEntries(MODULES.map(m => [m.key, value])),
    }));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="h-7 w-7" /> Controle de Acesso
          </h1>
          <p className="text-gray-500 text-sm mt-1">Defina o que cada função pode visualizar no sistema</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Permissões"}
        </Button>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Como funciona o controle de acesso</p>
          <p className="mt-1 text-blue-700">Marque os módulos que cada função pode acessar. O <strong>Administrador</strong> sempre tem acesso total. As permissões entram em vigor imediatamente após salvar.</p>
        </div>
      </div>

      {/* Seletor de função (mobile) */}
      <div className="flex flex-wrap gap-2 md:hidden">
        {ROLES.map(r => (
          <button
            key={r.key}
            onClick={() => setSelectedRole(selectedRole === r.key ? null : r.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedRole === r.key ? r.color + " ring-2 ring-offset-1 ring-emerald-500" : "bg-gray-100 text-gray-600"}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Tabela de permissões - Desktop */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-700 w-48">Módulo</th>
              {ROLES.map(r => (
                <th key={r.key} className="p-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.color}`}>{r.label}</span>
                    <div className="flex gap-1 mt-1">
                      <button onClick={() => setAllForRole(r.key, true)} className="text-xs text-emerald-600 hover:underline">Tudo</button>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => setAllForRole(r.key, false)} className="text-xs text-red-500 hover:underline">Nada</button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m, idx) => (
              <tr key={m.key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="p-4">
                  <p className="font-medium text-gray-800">{m.label}</p>
                  <p className="text-xs text-gray-400">{m.desc}</p>
                </td>
                {ROLES.map(r => (
                  <td key={r.key} className="p-3 text-center">
                    <button
                      onClick={() => toggle(r.key, m.key)}
                      className={`w-10 h-6 rounded-full transition-all duration-200 relative ${permissions[r.key]?.[m.key] ? "bg-emerald-500" : "bg-gray-200"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${permissions[r.key]?.[m.key] ? "left-4.5 translate-x-0" : "left-0.5"}`} />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards de permissão - Mobile */}
      <div className="md:hidden space-y-4">
        {ROLES.filter(r => !selectedRole || r.key === selectedRole).map(r => (
          <Card key={r.key}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${r.color}`}>{r.label}</span>
                <div className="flex gap-2">
                  <button onClick={() => setAllForRole(r.key, true)} className="text-xs text-emerald-600 hover:underline">Tudo</button>
                  <button onClick={() => setAllForRole(r.key, false)} className="text-xs text-red-500 hover:underline">Nada</button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MODULES.map(m => (
                <div key={m.key} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.label}</p>
                    <p className="text-xs text-gray-400">{m.desc}</p>
                  </div>
                  <button
                    onClick={() => toggle(r.key, m.key)}
                    className={`flex-shrink-0 w-12 h-6 rounded-full transition-all duration-200 relative ${permissions[r.key]?.[m.key] ? "bg-emerald-500" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${permissions[r.key]?.[m.key] ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-4 rounded-full bg-emerald-500" />
          <span>Acesso liberado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-4 rounded-full bg-gray-200" />
          <span>Acesso bloqueado</span>
        </div>
      </div>
    </div>
  );
}
