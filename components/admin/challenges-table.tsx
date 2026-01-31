"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Target,
  Clock,
  Award,
  BookOpen,
} from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import {
  type Challenge,
  fetchChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  type Meta,
} from "../../lib/challengess"
import { Spinner } from "../ui/spinner"

export function ChallengesTable() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<Meta | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadChallenges(currentPage)
  }, [currentPage])

  const loadChallenges = async (page: number) => {
    try {
      setLoading(true)
      const { challenges: fetchedChallenges, meta: fetchedMeta } = await fetchChallenges(page, 10)
      setChallenges(fetchedChallenges)
      setFilteredChallenges(fetchedChallenges)
      setMeta(fetchedMeta)
    } catch (error) {
      toast({
        title: "Xato",
        description: "Challengelarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = challenges.filter(
      (challenge) =>
        challenge.title.toLowerCase().includes(query.toLowerCase()) ||
        challenge.description.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredChallenges(filtered)
  }

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = async (id: number) => {
    try {
      await deleteChallenge(id)
      toast({
        title: "Muvaffaqiyatli",
        description: "Challenge o'chirildi",
      })
      loadChallenges(currentPage)
      setDeleteConfirm(null)
    } catch (error) {
      toast({
        title: "Xato",
        description: "Challengeni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (formData: any) => {
    try {
      if (editingChallenge) {
        await updateChallenge(editingChallenge.id, formData)
        toast({
          title: "Muvaffaqiyatli",
          description: "Challenge tahrirlandi",
        })
      } else {
        await createChallenge(formData)
        toast({
          title: "Muvaffaqiyatli",
          description: "Yangi challenge qo'shildi",
        })
      }
      setIsDialogOpen(false)
      setEditingChallenge(null)
      loadChallenges(currentPage)
    } catch (error) {
      toast({
        title: "Xato",
        description: "Saqlashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  if (loading && challenges.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
           Challengelar
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <ChallengeDialog
            challenge={null}
            onSave={handleSave}
            isOpen={isDialogOpen && !editingChallenge}
            setIsOpen={(open) => !editingChallenge && setIsDialogOpen(open)}
          />
        </div>
      </div>

      {filteredChallenges.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="group">
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                <CardContent className="pt-6 space-y-3">
                  {/* Title */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base leading-tight line-clamp-2">{challenge.title}</h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 ">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleEdit(challenge)} className="gap-2">
                          <Edit className="h-4 w-4 text-blue-500" />
                        
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteConfirm(challenge.id)} className="gap-2 text-red-600">
                          <Trash2 className="h-4 text-red-500 w-4" />
                        
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="flex items-center gap-1.5 bg-primary/30 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
                      <Award className="h-3.5 w-3.5" />
                      {challenge.points} ball
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary/50 text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {challenge.estimated_time}
                    </div>
                  </div>

                  {/* Instructions Preview */}
                  {challenge.instructions && challenge.instructions.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{challenge.instructions.length} ko'rsatma</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-center">Challenge topilmadi</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={!meta.back_page}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Oldingi</span>
          </Button>

          <div className="text-xs sm:text-sm text-muted-foreground">
            Sahifa {meta.page} / {meta.total_pages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(meta.total_pages, p + 1))}
            disabled={!meta.next_page}
            className="gap-2"
          >
            <span className="hidden sm:inline">Keyingi</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      {editingChallenge && (
        <ChallengeDialog
          challenge={editingChallenge}
          onSave={handleSave}
          isOpen={isDialogOpen && !!editingChallenge}
          setIsOpen={(open) => {
            setIsDialogOpen(open)
            if (!open) setEditingChallenge(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Challenge o'chirilsinmi?
            </DialogTitle>
            <DialogDescription>Bu amalni qaytarish mumkin emas. Challenge butunlay o'chiriladi.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && confirmDelete(deleteConfirm)}
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              O'chirish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ChallengeDialog({
  challenge,
  onSave,
  isOpen,
  setIsOpen,
}: {
  challenge: Challenge | null
  onSave: (data: any) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: 100,
    estimated_time: "1 hour",
    instructions: [] as string[],
    newInstruction: "",
  })

  useEffect(() => {
    if (challenge) {
      setFormData({
        title: challenge.title,
        description: challenge.description,
        points: challenge.points,
        estimated_time: challenge.estimated_time,
        instructions: challenge.instructions || [],
        newInstruction: "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        points: 100,
        estimated_time: "1 hour",
        instructions: [],
        newInstruction: "",
      })
    }
  }, [challenge, isOpen])

  const handleAddInstruction = () => {
    if (formData.newInstruction.trim()) {
      setFormData({
        ...formData,
        instructions: [...formData.instructions, formData.newInstruction],
        newInstruction: "",
      })
    }
  }

  const handleRemoveInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index),
    })
  }

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      return
    }

    const dataToSave = {
      title: formData.title,
      description: formData.description,
      points: formData.points,
      estimated_time: formData.estimated_time,
      instructions: formData.instructions,
    }

    onSave(dataToSave)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {!challenge && (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Yangi Challenge</span>
            <span className="sm:hidden">Qo'sh</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {challenge ? "Challengeni tahrirlash" : "Yangi challenge"}
          </DialogTitle>
          <DialogDescription>Challenge ma'lumotlarini kiriting</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Challenge nomi"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            placeholder="Tavsifi"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Ball"
              min="1"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) })}
            />
            <Input
              placeholder="Vaqt (masalan: 2 hours)"
              value={formData.estimated_time}
              onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Ko'rsatmalar
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Ko'rsatma qo'shish..."
                value={formData.newInstruction}
                onChange={(e) => setFormData({ ...formData, newInstruction: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddInstruction()
                  }
                }}
              />
              <Button size="sm" className="bg-green-500 text-white" variant="outline" onClick={handleAddInstruction} type="button">
                Qo'sh
              </Button>
            </div>

            {formData.instructions.length > 0 && (
              <div className="space-y-2 bg-muted p-3 rounded-md">
                {formData.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-2 text-sm p-2 bg-background rounded border border-border"
                  >
                    <span className="flex-1">{instruction}</span>
                    <button
                      onClick={() => handleRemoveInstruction(index)}
                      className="flex-shrink-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Bekor qilish
            </Button>
            <Button onClick={handleSave} className="flex-1 gap-2">
              <Award className="h-4 w-4" />
              Saqlash
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
