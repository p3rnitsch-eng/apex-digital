/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const Contact = IDL.Record({
  'name': IDL.Text,
  'email': IDL.Text,
  'message': IDL.Text,
  'timestamp': IDL.Int,
});

export const LeadNote = IDL.Record({
  'id': IDL.Text,
  'body': IDL.Text,
  'createdAt': IDL.Int,
});

export const ProjectSubmission = IDL.Record({
  'projectId': IDL.Text,
  'package': IDL.Text,
  'clientName': IDL.Text,
  'email': IDL.Text,
  'businessName': IDL.Text,
  'currentWebsite': IDL.Text,
  'businessType': IDL.Text,
  'whatTheyNeed': IDL.Text,
  'projectDescription': IDL.Text,
  'numberOfPages': IDL.Text,
  'needsContactForm': IDL.Bool,
  'needsBooking': IDL.Bool,
  'needsPaymentIntegration': IDL.Bool,
  'needsDashboard': IDL.Bool,
  'needsContentWriting': IDL.Bool,
  'needsBranding': IDL.Bool,
  'inspirationLinks': IDL.Text,
  'timeline': IDL.Text,
  'contentReadiness': IDL.Text,
  'additionalNotes': IDL.Text,
  'paymentStatus': IDL.Text,
  'transactionHash': IDL.Text,
  'crmStatus': IDL.Text,
  'priority': IDL.Text,
  'quoteStatus': IDL.Text,
  'quoteAmount': IDL.Text,
  'quoteSummary': IDL.Text,
  'quoteToken': IDL.Opt(IDL.Text),
  'quoteExpiresAt': IDL.Opt(IDL.Int),
  'followUpAt': IDL.Opt(IDL.Int),
  'internalNotes': IDL.Vec(LeadNote),
  'timestamp': IDL.Int,
  'lastUpdated': IDL.Int,
});

export const PublicQuote = IDL.Record({
  'projectId': IDL.Text,
  'clientName': IDL.Text,
  'businessName': IDL.Text,
  'package': IDL.Text,
  'quoteAmount': IDL.Text,
  'quoteSummary': IDL.Text,
  'quoteStatus': IDL.Text,
  'quoteExpiresAt': IDL.Opt(IDL.Int),
});

export const AdminStats = IDL.Record({
  'totalProjects': IDL.Nat,
  'totalContacts': IDL.Nat,
  'paidProjects': IDL.Nat,
  'pendingProjects': IDL.Nat,
  'followUpsDue': IDL.Nat,
});

export const AdminDashboard = IDL.Record({
  'projects': IDL.Vec(ProjectSubmission),
  'contacts': IDL.Vec(Contact),
  'stats': AdminStats,
});

export const idlService = IDL.Service({
  'adminGetDashboard': IDL.Func([IDL.Text], [AdminDashboard], []),
  'adminLogin': IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
  'adminLogout': IDL.Func([IDL.Text], [], []),
  'adminCreateQuote': IDL.Func(
    [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Opt(IDL.Int)],
    [IDL.Opt(IDL.Text)],
    [],
  ),
  'adminDeleteContact': IDL.Func([IDL.Text, IDL.Int], [IDL.Bool], []),
  'adminDeleteProject': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
  'adminUpdateProject': IDL.Func(
    [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Opt(IDL.Int), IDL.Opt(IDL.Text)],
    [IDL.Bool],
    [],
  ),
  'adminValidateSession': IDL.Func([IDL.Text], [IDL.Bool], []),
  'getPublicQuote': IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(PublicQuote)], ['query']),
  'getContacts': IDL.Func([], [IDL.Vec(Contact)], ['query']),
  'getProjects': IDL.Func([], [IDL.Vec(ProjectSubmission)], ['query']),
  'submitContact': IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], []),
  'submitProject': IDL.Func(
    [
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Bool,
      IDL.Bool,
      IDL.Bool,
      IDL.Bool,
      IDL.Bool,
      IDL.Bool,
      IDL.Text,
      IDL.Text,
      IDL.Text,
      IDL.Text,
    ],
    [IDL.Text],
    [],
  ),
  'updatePaymentStatus': IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const Contact = IDL.Record({
    'name': IDL.Text,
    'email': IDL.Text,
    'message': IDL.Text,
    'timestamp': IDL.Int,
  });
  const LeadNote = IDL.Record({
    'id': IDL.Text,
    'body': IDL.Text,
    'createdAt': IDL.Int,
  });
  const ProjectSubmission = IDL.Record({
    'projectId': IDL.Text,
    'package': IDL.Text,
    'clientName': IDL.Text,
    'email': IDL.Text,
    'businessName': IDL.Text,
    'currentWebsite': IDL.Text,
    'businessType': IDL.Text,
    'whatTheyNeed': IDL.Text,
    'projectDescription': IDL.Text,
    'numberOfPages': IDL.Text,
    'needsContactForm': IDL.Bool,
    'needsBooking': IDL.Bool,
    'needsPaymentIntegration': IDL.Bool,
    'needsDashboard': IDL.Bool,
    'needsContentWriting': IDL.Bool,
    'needsBranding': IDL.Bool,
    'inspirationLinks': IDL.Text,
    'timeline': IDL.Text,
    'contentReadiness': IDL.Text,
    'additionalNotes': IDL.Text,
    'paymentStatus': IDL.Text,
    'transactionHash': IDL.Text,
    'crmStatus': IDL.Text,
    'priority': IDL.Text,
    'quoteStatus': IDL.Text,
    'quoteAmount': IDL.Text,
    'quoteSummary': IDL.Text,
    'quoteToken': IDL.Opt(IDL.Text),
    'quoteExpiresAt': IDL.Opt(IDL.Int),
    'followUpAt': IDL.Opt(IDL.Int),
    'internalNotes': IDL.Vec(LeadNote),
    'timestamp': IDL.Int,
    'lastUpdated': IDL.Int,
  });
  const PublicQuote = IDL.Record({
    'projectId': IDL.Text,
    'clientName': IDL.Text,
    'businessName': IDL.Text,
    'package': IDL.Text,
    'quoteAmount': IDL.Text,
    'quoteSummary': IDL.Text,
    'quoteStatus': IDL.Text,
    'quoteExpiresAt': IDL.Opt(IDL.Int),
  });
  const AdminStats = IDL.Record({
    'totalProjects': IDL.Nat,
    'totalContacts': IDL.Nat,
    'paidProjects': IDL.Nat,
    'pendingProjects': IDL.Nat,
    'followUpsDue': IDL.Nat,
  });
  const AdminDashboard = IDL.Record({
    'projects': IDL.Vec(ProjectSubmission),
    'contacts': IDL.Vec(Contact),
    'stats': AdminStats,
  });

  return IDL.Service({
    'adminGetDashboard': IDL.Func([IDL.Text], [AdminDashboard], []),
    'adminLogin': IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
    'adminLogout': IDL.Func([IDL.Text], [], []),
    'adminCreateQuote': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Opt(IDL.Int)],
      [IDL.Opt(IDL.Text)],
      [],
    ),
    'adminDeleteContact': IDL.Func([IDL.Text, IDL.Int], [IDL.Bool], []),
    'adminDeleteProject': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'adminUpdateProject': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Opt(IDL.Int), IDL.Opt(IDL.Text)],
      [IDL.Bool],
      [],
    ),
    'adminValidateSession': IDL.Func([IDL.Text], [IDL.Bool], []),
    'getPublicQuote': IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(PublicQuote)], ['query']),
    'getContacts': IDL.Func([], [IDL.Vec(Contact)], ['query']),
    'getProjects': IDL.Func([], [IDL.Vec(ProjectSubmission)], ['query']),
    'submitContact': IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], []),
    'submitProject': IDL.Func(
      [
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Bool,
        IDL.Bool,
        IDL.Bool,
        IDL.Bool,
        IDL.Bool,
        IDL.Bool,
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Text,
      ],
      [IDL.Text],
      [],
    ),
    'updatePaymentStatus': IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};

export const init = ({ IDL }) => {
  return [];
};
