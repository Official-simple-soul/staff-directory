import { useState, useEffect } from 'react'
import {
  TextInput,
  Select,
  Textarea,
  Box,
  Stack,
  FileInput,
  NumberInput,
  MultiSelect,
  Switch,
  Divider,
  Tabs,
  Grid,
  Paper,
  Text,
  Stepper,
  Card,
  List,
  Alert,
  Image,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  IconUpload,
  IconBook,
  IconVideo,
  IconPhoto,
  IconFileTypePdf,
  IconVideoFilled,
  IconInfoCircle,
  IconClock,
  IconSparkles,
  IconPlus,
  IconCheck,
} from '@tabler/icons-react'
import type { Content } from '@/types/content.type'
import { DatePicker } from '@mantine/dates'
import PageHeader from '@/components/PageHeader'
import { sharedInputProps } from '@/constant/ui'
import { colors } from '@/theme/theme'
import { CreateCollectionModal } from '@/components/modals/CreateCollectionModal'
import { useCollection } from '@/services/collection.service'
import { useContent } from '@/services/content.service'
import { Timestamp } from 'firebase/firestore'
import { uploadFileToStorage } from '@/utils/fileUpload'
import { useAnalytics } from '@/services/analytics.service'
import ActionModal from '@/components/modals/ActionModal'
import { useNavigate } from '@tanstack/react-router'

interface CreateContentModalProps {
  contentToEdit?: Content | null
}

const genres = [
  'action',
  'adventure',
  'comedy',
  'drama',
  'fantasy',
  'horror',
  'mystery',
  'romance',
  'sci-fi',
  'superhero',
  'thriller',
]

const UPLOAD_STEPS = [
  {
    label: 'Basic Info',
    icon: <IconInfoCircle size={16} />,
    description: 'Add title, author, and basic information',
  },
  {
    label: 'Content Details',
    icon: <IconBook size={16} />,
    description: 'Set genres, collection, and content details',
  },
  {
    label: 'Media Upload',
    icon: <IconUpload size={16} />,
    description: 'Upload cover image and media files',
  },
  {
    label: 'Publish',
    icon: <IconSparkles size={16} />,
    description: 'Review and publish your content',
  },
]

// File size validation functions
const validateFileSize = (
  file: File | null,
  maxSizeMB: number,
): string | null => {
  if (!file) return null
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB}MB`
  }
  return null
}

const validateImage = (file: File | null): string | null => {
  return validateFileSize(file, 0.6) // 600KB
}

const validatePDF = (file: File | null): string | null => {
  return validateFileSize(file, 4) // 4MB
}

const validateVideo = (file: File | null): string | null => {
  return validateFileSize(file, 100) // 100MB
}

function NewContent({ contentToEdit }: CreateContentModalProps) {
  const [contentType, setContentType] = useState<'comic' | 'video'>('comic')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImageError, setCoverImageError] = useState<string | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const { collections, incrementCollectionCount } = useCollection()
  const { analytics, incrementCount } = useAnalytics()
  const { createContent, updateContent } = useContent()
  const [mediaFileError, setMediaFileError] = useState<string | null>(null)
  const [isScheduled, setIsScheduled] = useState(false)
  const [openNewCollectionModal, setOpenNewCollectionModal] = useState(false)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  )
  const [contentCreatedModalOpen, setContentCreatedModalOpen] = useState(false)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    initialValues: {
      title: '',
      tag: '',
      author: '',
      collection: '',
      collectionId: '',
      collectionNum: 1,
      genre: [] as string[],
      preview: '',
      package: 'free' as 'free' | 'premium',
      status: 'draft' as 'draft' | 'published',
      type: 'comic' as 'comic' | 'video',
      pages: 1,
      duration: 0,
      scheduleDate: null as Date | null,
    },

    validate: {
      title: (value) => (value.trim() ? null : 'Title is required'),
      author: (value) => (value.trim() ? null : 'Author is required'),
      collection: (value) => (value.trim() ? null : 'Collection is required'),
      genre: (value) =>
        value.length > 0 ? null : 'At least one genre is required',
      preview: (value) =>
        value.trim() ? null : 'Preview description is required',
      pages: (value, values) =>
        values.type === 'comic' && (!value || value < 1)
          ? 'Pages must be at least 1'
          : null,
      duration: (value, values) =>
        values.type === 'video' && (!value || value < 1)
          ? 'Duration must be at least 1 minute'
          : null,
    },
  })

  // Handle cover image upload with preview and validation
  const handleCoverImageChange = (file: File | null) => {
    setCoverImage(file)
    setCoverImageError(null)

    if (file) {
      // Validate file size
      const error = validateImage(file)
      if (error) {
        setCoverImageError(error)
        setCoverImagePreview(null)
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setCoverImagePreview(null)
    }
  }

  // Handle media file upload with validation
  const handleMediaFileChange = (file: File | null) => {
    setMediaFile(file)
    setMediaFileError(null)

    if (file) {
      const error =
        contentType === 'comic' ? validatePDF(file) : validateVideo(file)
      if (error) {
        setMediaFileError(error)
      }
    }
  }

  // Auto-fill collection data when collection is selected
  const handleCollectionChange = (collectionId: string) => {
    const selectedCollection = collections.find(
      (col) => col.id === collectionId,
    )
    if (selectedCollection) {
      form.setValues({
        ...form.values,
        author: selectedCollection.author,
        collection: selectedCollection.name,
        collectionId: selectedCollection.id,
        genre: selectedCollection.genre,
        collectionNum: (selectedCollection.count || 0) + 1,
        type: selectedCollection.type,
      })
      setContentType(selectedCollection.type as 'comic' | 'video')
    }
  }

  useEffect(() => {
    if (contentToEdit) {
      form.setValues({
        title: contentToEdit.title,
        tag: contentToEdit.tag,
        author: contentToEdit.author,
        collection: contentToEdit.collectionId || '',
        collectionNum: contentToEdit.collectionNum,
        genre: contentToEdit.genre,
        preview: contentToEdit.preview,
        package: contentToEdit.package,
        status: contentToEdit.status,
        type: contentToEdit.type,
        pages: contentToEdit.pages,
        duration: 0,
      })
      setContentType(contentToEdit.type)
      setIsScheduled(!!contentToEdit.schedule)
      setCoverImagePreview(contentToEdit.img)
    } else {
      form.reset()
      setCoverImage(null)
      setMediaFile(null)
      setIsScheduled(false)
      setCoverImagePreview(null)
    }
  }, [contentToEdit])

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true)
    try {
      if (!contentToEdit) {
        if (!coverImage) {
          setCoverImageError('Cover image is required')
          return
        }
        if (!mediaFile) {
          setMediaFileError('Media file is required')
          return
        }
      }

      if (coverImageError || mediaFileError) {
        notifications.show({
          title: 'Validation Error',
          message: 'Please fix the file upload errors',
          color: 'red',
        })
        return
      }

      let imgUrl = contentToEdit?.img || ''
      let mediaUrl = contentToEdit?.pdf || contentToEdit?.video || ''

      if (coverImage) {
        const coverImagePath = `comic-images/${values.title.replace(/\s+/g, '_')}${values.collectionNum}`
        imgUrl = await uploadFileToStorage(coverImage, coverImagePath)
      }

      if (mediaFile) {
        const mediaPath =
          contentType === 'comic'
            ? `comics-pdf/${values.title.replace(/\s+/g, '_')}${values.collectionNum}`
            : `videos/${values.title.replace(/\s+/g, '_')}${values.collectionNum}`
        mediaUrl = await uploadFileToStorage(mediaFile, mediaPath)
      }

      console.log('Uploaded URLs:', { imgUrl, mediaUrl })

      const contentData = {
        ...values,
        type: contentType,
        img: imgUrl,
        ...(contentType === 'comic' && { pdf: mediaUrl }),
        ...(contentType === 'video' && { video: mediaUrl }),
        schedule:
          isScheduled && values.scheduleDate
            ? Timestamp.fromDate(new Date(values.scheduleDate))
            : null,
        ...(!contentToEdit && {
          key:
            `${values.collection.split(' ').join('')}${values.collectionNum}` ||
            '',
          num: (analytics?.content || 0) + 1,
          totalCompletions: 0,
          totalReads: 0,
          totalViews: 0,
          view: 0,
          viewIds: [],
          rating: 0,
          reviews: 0,
          uploaded: Timestamp.now(),
        }),
      }

      console.log('Submitting content:', contentData)

      if (contentToEdit) {
        await updateContent({
          id: contentToEdit.id!,
          data: contentData,
        })
      } else {
        await createContent(contentData)

        // Then update collection count and analytics
        await Promise.all([
          incrementCollectionCount(values.collectionId),

          incrementCount({ field: 'content', amount: 1 }),
        ])

        notifications.show({
          title: 'Success',
          message: 'Content created successfully',
          color: colors.primary,
        })
        setContentCreatedModalOpen(true)
      }

      form.reset()
      setCoverImage(null)
      setMediaFile(null)
      setCoverImagePreview(null)
    } catch (error) {
      console.error('Error submitting content:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to upload content. Please try again.',
        color: 'red',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PageHeader
            back={true}
            actionLabel={contentToEdit ? 'Update Content' : 'Upload Content'}
            onAction={form.onSubmit(handleSubmit)}
            loading={isLoading}
          />
          <Tabs
            defaultValue="comic"
            value={contentType}
            onChange={(v) => setContentType(v as 'comic' | 'video')}
            mt={'xl'}
            color={colors.primary}
          >
            <Tabs.List grow mb="md">
              <Tabs.Tab value="comic" leftSection={<IconBook size={16} />}>
                Comic
              </Tabs.Tab>
              <Tabs.Tab value="video" leftSection={<IconVideo size={16} />}>
                Video
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Title"
                    placeholder="Enter content title"
                    required
                    {...form.getInputProps('title')}
                    {...sharedInputProps()}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Package"
                    required
                    data={[
                      { value: 'free', label: 'Free' },
                      { value: 'premium', label: 'Premium' },
                    ]}
                    {...form.getInputProps('package')}
                    {...sharedInputProps()}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Tagline"
                placeholder="Enter a catchy tagline"
                {...form.getInputProps('tag')}
                {...sharedInputProps()}
              />

              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Collection"
                    placeholder="Select a collection"
                    required
                    data={collections.map((col) => ({
                      value: col.id!,
                      label: col.name,
                    }))}
                    searchable
                    {...form.getInputProps('collectionId')}
                    onChange={(value) => {
                      form.getInputProps('collectionId').onChange(value)
                      if (value) handleCollectionChange(value)
                    }}
                    {...sharedInputProps()}
                  />
                  <div className="flex items-center gap-1 mt-1 text-primary cursor-pointer">
                    <IconPlus size={12} />
                    <p
                      className="text-xs text-primary"
                      onClick={() => setOpenNewCollectionModal(true)}
                    >
                      New Collection
                    </p>
                  </div>
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Author"
                    placeholder="Content author"
                    required
                    {...form.getInputProps('author')}
                    {...sharedInputProps()}
                    readOnly
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Collection Number"
                    placeholder="Sequence in collection"
                    min={1}
                    required
                    {...form.getInputProps('collectionNum')}
                    {...sharedInputProps()}
                    readOnly
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <MultiSelect
                    label="Genres"
                    placeholder="Select genres"
                    required
                    data={genres}
                    searchable
                    {...form.getInputProps('genre')}
                    {...sharedInputProps()}
                    readOnly
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  {contentType === 'comic' ? (
                    <NumberInput
                      label="Number of Pages"
                      min={1}
                      required
                      {...form.getInputProps('pages')}
                      {...sharedInputProps()}
                    />
                  ) : (
                    <NumberInput
                      label="Duration (minutes)"
                      min={1}
                      required
                      {...form.getInputProps('duration')}
                      {...sharedInputProps()}
                    />
                  )}
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Status"
                    data={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'published', label: 'Published' },
                    ]}
                    {...form.getInputProps('status')}
                    {...sharedInputProps()}
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Preview Description"
                placeholder="Enter a short description of the content"
                required
                autosize
                minRows={3}
                {...form.getInputProps('preview')}
                {...sharedInputProps()}
              />

              <Divider my="sm" />

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <FileInput
                    label="Cover Image"
                    placeholder="Upload cover image"
                    accept="image/png,image/jpeg,image/webp"
                    leftSection={<IconUpload size={16} />}
                    value={coverImage}
                    onChange={handleCoverImageChange}
                    required={!contentToEdit}
                    description="Max size: 600KB"
                    error={coverImageError}
                    {...sharedInputProps()}
                  />
                  {(coverImagePreview || contentToEdit?.img) && (
                    <div className="mt-3">
                      <Text size="sm" fw={500} mb="xs">
                        Preview:
                      </Text>
                      <Image
                        src={coverImagePreview || contentToEdit?.img}
                        height={200}
                        width={150}
                        alt="Cover preview"
                        className="object-cover rounded-md border border-gray-300"
                        fallbackSrc="https://placehold.co/150x200?text=Preview"
                        radius={'lg'}
                      />
                    </div>
                  )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <FileInput
                    label={contentType === 'comic' ? 'PDF File' : 'Video File'}
                    placeholder={`Upload ${contentType === 'comic' ? 'PDF' : 'video'}`}
                    accept={
                      contentType === 'comic'
                        ? 'application/pdf'
                        : 'video/mp4,video/webm'
                    }
                    leftSection={<IconUpload size={16} />}
                    value={mediaFile}
                    onChange={handleMediaFileChange}
                    required={!contentToEdit}
                    description={
                      contentType === 'comic'
                        ? 'Max size: 4MB'
                        : 'Max size: 100MB'
                    }
                    error={mediaFileError}
                    {...sharedInputProps()}
                  />
                </Grid.Col>
              </Grid>

              <Divider my="sm" />

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Switch
                    label="Schedule for later"
                    checked={isScheduled}
                    onChange={(event) =>
                      setIsScheduled(event.currentTarget.checked)
                    }
                    {...sharedInputProps()}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  {isScheduled && (
                    <div className="flex flex-col items-center justify-center">
                      <DatePicker
                        minDate={new Date()}
                        {...form.getInputProps('scheduleDate')}
                      />
                    </div>
                  )}
                </Grid.Col>
              </Grid>
            </Stack>
          </Box>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <Paper
            withBorder
            p="md"
            radius="lg"
            className="sticky top-6 bg-background/80 backdrop-blur-sm"
          >
            <div className="mb-6">
              <Text fw={500} size="lg" mb="sm">
                Quick Guide
              </Text>
              <Stepper active={0} orientation="vertical" size="sm">
                {UPLOAD_STEPS.map((step, index) => (
                  <Stepper.Step
                    key={index}
                    label={step.label}
                    description={step.description}
                    icon={step.icon}
                    color={colors.primary}
                  />
                ))}
              </Stepper>
            </div>

            <Card withBorder radius="md" className="mb-6">
              <Text fw={500} size="lg" mb="md">
                📋 Requirements
              </Text>
              <List spacing="xs" size="sm" center>
                <List.Item icon={<IconPhoto size={16} />}>
                  Cover Image (600kb max)
                </List.Item>
                <List.Item
                  icon={
                    contentType === 'comic' ? (
                      <IconFileTypePdf size={16} />
                    ) : (
                      <IconVideoFilled size={16} />
                    )
                  }
                >
                  {contentType === 'comic'
                    ? 'PDF File (4MB max)'
                    : 'Video File (100MB max)'}
                </List.Item>
                <List.Item icon={<IconInfoCircle size={16} />}>
                  Complete all required fields
                </List.Item>
              </List>
            </Card>

            {/* Tips & Best Practices */}
            <Card withBorder radius="md" className="mb-6">
              <Text fw={500} size="lg" mb="md">
                💡 Pro Tips
              </Text>
              <List spacing="xs" size="sm">
                <List.Item>
                  Use high-quality cover images (300x400 recommended)
                </List.Item>
                <List.Item>Write engaging preview descriptions</List.Item>
                <List.Item>
                  Select relevant genres for better discovery
                </List.Item>
                <List.Item>Schedule releases for optimal timing</List.Item>
              </List>
            </Card>

            <Alert
              variant="light"
              color={colors.primary}
              title="Status Guide"
              icon={<IconInfoCircle />}
            >
              <Text size="sm">
                <strong>Draft:</strong> Save for later editing
                <br />
                <strong>Published:</strong> Make immediately visible to users
              </Text>
            </Alert>

            {isScheduled && (
              <Alert
                variant="light"
                color="orange"
                title="Scheduled Release"
                icon={<IconClock />}
                mt="md"
              >
                <Text size="sm">
                  Your content will be automatically published on the selected
                  date
                </Text>
              </Alert>
            )}

            {form.values.package === 'premium' && (
              <Alert
                variant="light"
                color="yellow"
                title="Premium Benefits"
                icon={<IconSparkles />}
                mt="md"
              >
                <Text size="sm">
                  Premium content generates revenue and gets featured placement
                </Text>
              </Alert>
            )}
          </Paper>
        </div>
      </div>
      <CreateCollectionModal
        opened={openNewCollectionModal}
        onClose={() => setOpenNewCollectionModal(false)}
      />
      <ActionModal
        opened={contentCreatedModalOpen}
        onClose={() => setContentCreatedModalOpen(false)}
        title={contentToEdit ? 'Content Updated' : 'Content Added'}
        icon={
          <div className="bg-layout p-2 rounded-full size-14 flex justify-center items-center">
            <IconCheck size={28} color={colors.primary} />
          </div>
        }
        message={
          <p className="text-info text-sm">
            {contentToEdit ? (
              <>Content updated successfully</>
            ) : (
              <>A new content has been uploaded successfully</>
            )}
          </p>
        }
        primaryButtonText={contentToEdit ? 'Done' : 'Upload More'}
        onPrimaryButtonClick={() => {
          setContentCreatedModalOpen(false)
          form.reset()
          setCoverImage(null)
          setMediaFile(null)
          setCoverImagePreview(null)
        }}
        primaryButtonColor={colors.primary}
        secondaryButtonText="Cancel"
        onSecondaryButtonClick={() => {
          navigate({ to: '/content' })
        }}
      />
    </div>
  )
}

export default NewContent
