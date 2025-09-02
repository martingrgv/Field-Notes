using System.Security.Claims;
using FieldNotes.Api.Common;
using FieldNotes.Api.Notes.Requests;
using FieldNotes.Api.Notes.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FieldNotes.Api.Notes;

[Authorize]
public class NotesController(INoteService noteService) : ApiControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllNotes([FromQuery] NotesQueryRequest request)
    {
        var pagedResult = await noteService.GetAllAsync(request);
        return Ok(pagedResult);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Details([FromRoute] Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("Invalid id!");
        }

        var note = await noteService.GetByIdAsync(id);
        var response = new NoteDetailsResponse
        {
            Title = note.Title,
            Category = note.Category,
            Description = note.Description,
            LastUpdated = note.LastUpdated,
            LastUpdatedBy = note.LastUpdatedBy
        };

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateNoteRequest request)
    {
        if (string.IsNullOrEmpty(request.Title))
        {
            return BadRequest("Title is required!");
        }

        Guid userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        string username = User.FindFirst("username")?.Value!;
        var note = await noteService.CreateAsync(request, userId, username);

        return CreatedAtAction(nameof(Create), new { id = note.Id });
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateNoteRequest request)
    {
        if (string.IsNullOrEmpty(request.Title))
        {
            return BadRequest("Title is required!");
        }

        string username = User.FindFirst("username")?.Value!;
        var note = await noteService.UpdateAsync(request, username);

        return Ok(note);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("Invalid id!");
        }

        await noteService.DeleteAsync(id);
        return Ok();
    }
}
