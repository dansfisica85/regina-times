'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Database, Shield, Bell, Download, Upload } from 'lucide-react'

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <p className="text-gray-500">Gerencie as configurações do sistema</p>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="geracao">Geração de Horários</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configurações básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Ano Letivo</Label>
                  <Select defaultValue="2026">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semestre</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1º Semestre</SelectItem>
                      <SelectItem value="2">2º Semestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duração padrão da aula (minutos)</Label>
                  <Input type="number" defaultValue="50" min={30} max={120} />
                </div>
                <div className="space-y-2">
                  <Label>Máximo de escolas por professor (acúmulo)</Label>
                  <Input type="number" defaultValue="3" min={1} max={5} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Geração */}
        <TabsContent value="geracao">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Geração Automática</CardTitle>
              <CardDescription>
                Configure as regras do algoritmo de alocação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Prioridade por Categoria QM</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Ordem de prioridade na atribuição de aulas
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-medium">1º</span>
                      <span>Categoria A - Efetivos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm font-medium">2º</span>
                      <span>Categorias P, N, F - Estáveis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center bg-yellow-500 text-white rounded-full text-sm font-medium">3º</span>
                      <span>Categoria O - Contratados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center bg-gray-500 text-white rounded-full text-sm font-medium">4º</span>
                      <span>Categoria V - Eventuais (somente substituições)</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Critério de desempate</Label>
                    <Select defaultValue="menor_carga">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menor_carga">Menor carga horária alocada</SelectItem>
                        <SelectItem value="alfabetico">Ordem alfabética</SelectItem>
                        <SelectItem value="experiencia">Maior experiência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Permitir janelas no horário</Label>
                    <Select defaultValue="nao">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao">Não permitir</SelectItem>
                        <SelectItem value="uma">Até 1 janela</SelectItem>
                        <SelectItem value="duas">Até 2 janelas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button>Salvar Regras</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup e Restauração
              </CardTitle>
              <CardDescription>
                Gerencie os backups do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-2">Exportar Dados</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Faça backup de todos os dados do sistema
                    </p>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Backup
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-2">Importar Dados</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Restaure dados de um backup anterior
                    </p>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Backup
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Atenção</h4>
                <p className="text-sm text-yellow-700">
                  Importar um backup irá sobrescrever todos os dados atuais. 
                  Certifique-se de fazer um backup antes de importar.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança e LGPD
              </CardTitle>
              <CardDescription>
                Configurações de segurança e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Proteção de Dados (LGPD)</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• CPFs são armazenados de forma criptografada</p>
                    <p>• Logs de auditoria registram todas as alterações</p>
                    <p>• Dados sensíveis não são expostos em relatórios públicos</p>
                    <p>• Acesso baseado em papéis (RBAC)</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tempo de sessão (minutos)</Label>
                    <Input type="number" defaultValue="60" min={15} max={480} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tentativas de login antes de bloqueio</Label>
                    <Input type="number" defaultValue="5" min={3} max={10} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dias para manter logs de auditoria</Label>
                  <Select defaultValue="365">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="180">180 dias</SelectItem>
                      <SelectItem value="365">1 ano</SelectItem>
                      <SelectItem value="730">2 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button>Salvar Configurações de Segurança</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
