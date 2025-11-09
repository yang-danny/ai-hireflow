import { useState } from 'react';
import SparkleIcon from '../components/icons/SparkleIcon';
import UserIcon from '../components/icons/UserIcon';
import BriefcaseIcon from '../components/icons/BriefcaseIcon';
import GraduationCapIcon from '../components/icons/GraduationCapIcon';
import EyeIcon from '../components/icons/EyeIcon';
import SaveIcon from '../components/icons/SaveIcon';
import DocumentIcon from '../components/icons/DocumentIcon';
import { ProgressBar } from '../components/resume-generator/ProgressBar';
import { StepNavigationItem } from '../components/resume-generator/StepNavigationItem';
import { FormInput } from '../components/resume-generator/FormInput';
import { ActionButton } from '../components/resume-generator/ActionButton';
import { ResumePreviewPanel } from '../components/resume-generator/ResumePreviewPanel';
import { LogoIcon } from '~/components/icons/icons';
import { Header } from '~/components/Header';
import { mockRootProps } from '~/data/landingPageMockData';
import { title } from 'process';
import { useParams } from 'react-router';
import { AccentColorDialog } from '../components/resume-generator/AccentColorDialog';
import { TemplateSelectionDialog } from '../components/resume-generator/TemplateSelectionDialog';

export default function ResumeGenerator() {
   const [currentStep, setCurrentStep] = useState(1);
   const [fullName, setFullName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [emailError, setEmailError] = useState('');
   const [phoneError, setPhoneError] = useState('');
   const { resumeId } = useParams();
   const [resumeData, setResumeData] = useState({
      id: '',
      title: '',
      personal_info: {},
      professional_summary: '',
      experience: [],
      education: [],
      project: [],
      skills: [],
      template: 'classic',
      accent_color: 'blue',
      public: false,
   });
   const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
   const [accentColor, setAccentColor] = useState('blue');
   const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
   const [template, setTemplate] = useState('classic');

   const handleAccentColorSelect = (color: string) => {
      setAccentColor(color);
   };

   const handleTemplateSelect = (template: string) => {
      setTemplate(template);
   };

   const validateEmail = (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
         setEmailError('Please enter a valid email address');
      } else {
         setEmailError('');
      }
   };

   const validatePhone = (value: string) => {
      if (value && !/^[\d\s\-\(\)\+]+$/.test(value)) {
         setPhoneError('Please enter a valid phone number');
      } else {
         setPhoneError('');
      }
   };

   const handleEmailChange = (value: string) => {
      setEmail(value);
      validateEmail(value);
   };

   const handlePhoneChange = (value: string) => {
      setPhone(value);
      validatePhone(value);
   };

   const steps = [
      {
         id: 1,
         icon: <UserIcon width={16} height={16} color="currentColor" />,
         label: 'Personal Information',
      },
      {
         id: 2,
         icon: <DocumentIcon width={16} height={16} color="currentColor" />,
         label: 'Professional Summary',
      },
      {
         id: 3,
         icon: <SparkleIcon width={16} height={16} color="currentColor" />,
         label: 'Skills',
      },
      {
         id: 4,
         icon: <BriefcaseIcon width={19} height={18} color="currentColor" />,
         label: 'Work Experience',
      },
      {
         id: 5,
         icon: (
            <GraduationCapIcon width={21} height={18} color="currentColor" />
         ),
         label: 'Education',
      },
      {
         id: 6,
         icon: <BriefcaseIcon width={19} height={18} color="currentColor" />,
         label: 'Projects',
      },
      {
         id: 7,
         icon: (
            <GraduationCapIcon width={21} height={18} color="currentColor" />
         ),
         label: 'Certifications',
      },
   ];

   return (
      <div className="min-h-screen bg-(--color-background-dark) p-8">
         {/* Header */}
         <div className="flex items-center gap-3 mb-8">
            <Header navigation={mockRootProps.navigation} />
         </div>

         {/* Main Container */}
         <div className="flex flex-col gap-8 pt-8">
            {/* Progress Bar */}
            <ProgressBar
               currentStep={currentStep}
               totalSteps={7}
               stepTitle={steps.find((s) => s.id === currentStep)?.label || ''}
            />

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-[544px_1fr] gap-8">
               {/* Left Panel - Form Area */}
               <div className="flex flex-col gap-6 p-6 bg-(--color-form-background) rounded-xl shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)]">
                  {/* LinkedIn Import Button */}
                  <button className="w-full py-3 text-sm font-bold text-(--color-primary) tracking-wide hover:bg-(--color-primary)/10 transition-colors rounded-lg">
                     Load from LinkedIn
                  </button>

                  {/* Step Navigation */}
                  <div className="flex flex-col gap-4">
                     {steps.map((step) => (
                        <StepNavigationItem
                           key={step.id}
                           icon={step.icon}
                           label={step.label}
                           isActive={currentStep === step.id}
                           onClick={() => setCurrentStep(step.id)}
                        />
                     ))}
                  </div>

                  {/* Form Fields */}
                  <div className="flex flex-col gap-4">
                     <FormInput
                        label="Full Name"
                        placeholder="e.g. Jane Doe"
                        value={fullName}
                        onChange={setFullName}
                     />
                     <FormInput
                        label="Email Address"
                        placeholder="e.g. jane.doe@example.com"
                        value={email}
                        onChange={handleEmailChange}
                        type="email"
                        error={emailError}
                     />
                     <FormInput
                        label="Phone Number"
                        placeholder="e.g. (123) 456-7890"
                        value={phone}
                        onChange={handlePhoneChange}
                        type="tel"
                        error={phoneError}
                     />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 mt-2">
                     <ActionButton
                        icon={<span />}
                        label="AI Enhance"
                        variant="ai-enhance"
                        className="w-full"
                     />
                     <div className="grid grid-cols-3 gap-4">
                        <ActionButton
                           icon={
                              <SaveIcon
                                 width={18}
                                 height={18}
                                 color="#d1d5db"
                              />
                           }
                           label="Save"
                           variant="secondary"
                        />
                        <ActionButton
                           icon={
                              <SparkleIcon
                                 width={18}
                                 height={18}
                                 color="#d1d5db"
                              />
                           }
                           label="Accent"
                           variant="secondary"
                           onClick={() => setIsColorDialogOpen(true)}
                        />
                        <ActionButton
                           icon={
                              <DocumentIcon
                                 width={18}
                                 height={18}
                                 color="#d1d5db"
                              />
                           }
                           label="Select Template"
                           variant="secondary"
                           onClick={() => setIsTemplateDialogOpen(true)}
                        />
                     </div>
                  </div>
               </div>

               {/* Right Panel - Preview Area */}
               <ResumePreviewPanel />
            </div>
         </div>
         <AccentColorDialog
            isOpen={isColorDialogOpen}
            onClose={() => setIsColorDialogOpen(false)}
            onColorSelect={handleAccentColorSelect}
         />
         <TemplateSelectionDialog
            isOpen={isTemplateDialogOpen}
            onClose={() => setIsTemplateDialogOpen(false)}
            onTemplateSelect={handleTemplateSelect}
         />
      </div>
   );
}
