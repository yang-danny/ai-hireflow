import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner, LoadingButton, LoadingState } from '../components/Loading';
describe('Loading Components', () => {
   describe('Spinner', () => {
      it('should render with default size', () => {
         render(<Spinner />);
         expect(screen.getByRole('status')).toBeInTheDocument();
      });
      it('should have accessible label', () => {
         render(<Spinner />);
         expect(screen.getByLabelText('Loading')).toBeInTheDocument();
      });
   });
   describe('LoadingButton', () => {
      it('should show spinner when loading', () => {
         render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
         expect(screen.getByRole('status')).toBeInTheDocument();
      });
      it('should be disabled when loading', () => {
         render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
         const button = screen.getByRole('button');
         expect(button).toBeDisabled();
      });
      it('should show button text when not loading', () => {
         render(<LoadingButton isLoading={false}>Submit</LoadingButton>);
         expect(screen.getByText('Submit')).toBeVisible();
      });
   });
   describe('LoadingState', () => {
      it('should display custom message', () => {
         render(<LoadingState message="Please wait..." />);
         expect(screen.getByText('Please wait...')).toBeInTheDocument();
      });
   });
});
