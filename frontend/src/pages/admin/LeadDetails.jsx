import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getApiBaseUrl } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, User, Calendar, Briefcase, MapPin, Link as LinkIcon, IndianRupee } from 'lucide-react';

const API = getApiBaseUrl();

function useCountUp(targetValue, { durationMs = 800, start = true } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const n = Number(targetValue);
    if (!start || !Number.isFinite(n)) {
      setValue(Number.isFinite(n) ? n : 0);
      return;
    }

    let rafId;
    const startTs = performance.now();
    const from = 0;

    const tick = (ts) => {
      const progress = Math.min(1, (ts - startTs) / durationMs);
      const next = from + (n - from) * progress;
      setValue(next);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [durationMs, start, targetValue]);

  return value;
}

function Field({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 break-words">{String(value)}</div>
    </div>
  );
}

export default function LeadDetails() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const location = useLocation();

  const leadFromState = location.state?.lead;

  const [lead, setLead] = useState(leadFromState || null);
  const [loading, setLoading] = useState(!leadFromState);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const displayName = useMemo(() => {
    if (!lead) return '';
    return lead.display_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
  }, [lead]);

  const animatedFees = useCountUp(lead?.consulting_fees, { durationMs: 900, start: mounted && !!lead });
  const animatedExperience = useCountUp(lead?.experience_years, { durationMs: 900, start: mounted && !!lead });

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 10);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (leadFromState) return;

    const fetchLead = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        const response = await axios.get(`${API}/admin/onboarding/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const professionals = response.data.professionals || [];
        const found = professionals.find((p) => String(p.id) === String(leadId));
        if (!found) {
          setError('Lead not found');
        } else {
          setLead(found);
        }
      } catch (e) {
        if (e?.response?.status === 401) {
          localStorage.removeItem('admin_token');
          navigate('/admin/login');
        } else {
          setError(e?.response?.data?.error || e.message || 'Failed to load details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [API, leadFromState, leadId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <Card className="p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading details...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <Card className="p-8">
            <div className="text-center">
              <p className="text-gray-900 font-semibold">{error}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={`bg-white shadow-sm border-b sticky top-0 z-10 transition-all duration-500 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/admin/leads')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Leads
              </Button>
              <div>
                <div className="text-sm text-gray-500">Lead Details</div>
                <h1 className="text-xl font-bold text-gray-900">{displayName || 'Doctor'}</h1>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                lead.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : lead.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {lead.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate(`/admin/doctors?highlight=${lead.id}`)}>
                Open in Manage Doctors
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <div
          className={`transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          style={{ transitionDelay: '80ms' }}
        >
          <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              {lead.profile_photo ? (
                <img
                  src={lead.profile_photo}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">
                  {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-lg font-semibold text-gray-900">{displayName}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{lead.created_at ? new Date(lead.created_at).toLocaleString() : ''}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4" />
                <span className="break-all">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4" />
                <span>{lead.phone || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4" />
                <span>{[lead.country, lead.state].filter(Boolean).join(', ') || '—'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Briefcase className="w-4 h-4" />
                <span>{lead.profession_qualification || lead.speciality || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <IndianRupee className="w-4 h-4" />
                <span>
                  {lead.consulting_fees !== undefined && lead.consulting_fees !== null
                    ? Math.round(animatedFees).toLocaleString('en-IN')
                    : '—'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span>{lead.subdomain ? `/${lead.subdomain}` : '—'}</span>
              </div>
            </div>
          </div>
          </Card>
        </div>

        {lead.bio && (
          <div
            className={`transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
            style={{ transitionDelay: '160ms' }}
          >
            <Card className="p-6">
              <div className="text-sm font-semibold text-gray-900 mb-2">Bio</div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{lead.bio}</div>
            </Card>
          </div>
        )}

        <div
          className={`transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          style={{ transitionDelay: lead.bio ? '240ms' : '160ms' }}
        >
          <Card className="p-6">
            <div className="text-sm font-semibold text-gray-900 mb-4">Full Information</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="First Name" value={lead.first_name} />
              <Field label="Last Name" value={lead.last_name} />
              <Field label="Display Name" value={lead.display_name} />

              <Field label="Email" value={lead.email} />
              <Field label="Phone" value={lead.phone} />
              <Field label="Status" value={lead.status} />

              <Field label="Country" value={lead.country} />
              <Field label="State" value={lead.state} />
              <Field label="Subdomain" value={lead.subdomain} />

              <Field label="Speciality" value={lead.speciality} />
              <Field label="UG Qualification" value={lead.ug_qualification} />
              <Field label="PG Qualification" value={lead.pg_qualification} />
              <Field label="Superspeciality" value={lead.superspeciality} />
              <Field label="Area of Expertise" value={lead.area_of_expertise} />

              <Field label="Profession Qualification" value={lead.profession_qualification} />
              <Field
                label="Experience (years)"
                value={lead.experience_years !== undefined && lead.experience_years !== null ? Math.round(animatedExperience) : lead.experience_years}
              />

              <Field label="Instagram" value={lead.instagram} />
              <Field label="YouTube" value={lead.youtube} />
              <Field label="Twitter" value={lead.twitter} />
              <Field label="LinkedIn" value={lead.linkedin} />
              <Field label="Facebook" value={lead.facebook} />

              <Field label="Theme Color" value={lead.theme_color} />
              <Field label="Profile Photo" value={lead.profile_photo} />
              <Field label="Intro Video" value={lead.intro_video} />

              <Field label="Morning Time" value={lead.morning_time} />
              <Field label="Evening Time" value={lead.evening_time} />
              <Field label="Appointment Days" value={Array.isArray(lead.appointment_days) ? lead.appointment_days.join(', ') : lead.appointment_days} />

              <Field label="Created At" value={lead.created_at} />
              <Field label="Updated At" value={lead.updated_at} />
              <Field label="Razorpay Account Id" value={lead.razorpay_account_id} />

              <Field label="Bank Account Name" value={lead.bank_account_name} />
              <Field label="Bank Account Number" value={lead.bank_account_number} />
              <Field label="Bank IFSC" value={lead.bank_ifsc_code} />
              <Field label="Bank Branch" value={lead.bank_branch} />
            </div>

            {(lead.linkedin || lead.facebook || lead.instagram || lead.youtube || lead.twitter) && (
              <div className="mt-6">
                <div className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Social Links
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {lead.instagram && <a className="text-blue-600 hover:underline break-all" href={lead.instagram} target="_blank" rel="noreferrer">{lead.instagram}</a>}
                  {lead.youtube && <a className="text-blue-600 hover:underline break-all" href={lead.youtube} target="_blank" rel="noreferrer">{lead.youtube}</a>}
                  {lead.twitter && <a className="text-blue-600 hover:underline break-all" href={lead.twitter} target="_blank" rel="noreferrer">{lead.twitter}</a>}
                  {lead.linkedin && <a className="text-blue-600 hover:underline break-all" href={lead.linkedin} target="_blank" rel="noreferrer">{lead.linkedin}</a>}
                  {lead.facebook && <a className="text-blue-600 hover:underline break-all" href={lead.facebook} target="_blank" rel="noreferrer">{lead.facebook}</a>}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
